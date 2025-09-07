import React, { useState, useRef, useEffect } from 'react';
import { FileText, Edit3, GripVertical, Plus, Scissors, Copy, Trash2 } from 'lucide-react';
import { getOptionLabel, getQuestionPrefix } from '../utils/languageOptions';

function EnhancedPreview({ 
  questions, 
  optionLayout, 
  paperName, 
  layoutSettings = {},
  onQuestionsReorder,
  onQuestionEdit,
  onQuestionDelete,
  onAddPageBreak
}) {
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [pageBreaks, setPageBreaks] = useState(new Set());
  const [hoveredQuestion, setHoveredQuestion] = useState(null);
  const previewRef = useRef(null);

  // Calculate page height based on A4 dimensions
  const pageHeight = 1122; // A4 height in pixels at 96 DPI
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Calculate page breaks automatically
    if (previewRef.current) {
      const questionElements = previewRef.current.querySelectorAll('.question-item');
      const newPageBreaks = new Set();
      let currentHeight = 0;
      
      questionElements.forEach((el, index) => {
        currentHeight += el.offsetHeight;
        if (currentHeight > pageHeight - 100) { // Leave margin
          newPageBreaks.add(index);
          currentHeight = el.offsetHeight;
        }
      });
      
      setPageBreaks(newPageBreaks);
    }
  }, [questions, layoutSettings]);

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const draggedQuestion = questions[draggedIndex];
    const newQuestions = [...questions];
    
    // Remove dragged item
    newQuestions.splice(draggedIndex, 1);
    
    // Insert at new position
    const adjustedIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex;
    newQuestions.splice(adjustedIndex, 0, draggedQuestion);
    
    onQuestionsReorder(newQuestions);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const startEditing = (index, field, currentValue) => {
    setEditingIndex(index);
    setEditingField(field);
    setEditValue(currentValue);
  };

  const saveEdit = () => {
    if (editingIndex !== null && editingField !== null) {
      const updatedQuestion = { ...questions[editingIndex] };
      
      if (editingField === 'question') {
        updatedQuestion.question = editValue;
      } else if (editingField.startsWith('option-')) {
        const optionIndex = parseInt(editingField.split('-')[1]);
        updatedQuestion.options[optionIndex] = editValue;
      }
      
      onQuestionEdit(editingIndex, updatedQuestion);
    }
    
    setEditingIndex(null);
    setEditingField(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditingField(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  };

  const togglePageBreak = (index) => {
    const newPageBreaks = new Set(pageBreaks);
    if (newPageBreaks.has(index)) {
      newPageBreaks.delete(index);
    } else {
      newPageBreaks.add(index);
    }
    setPageBreaks(newPageBreaks);
  };

  const duplicateQuestion = (index) => {
    const questionToDuplicate = { ...questions[index] };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, questionToDuplicate);
    onQuestionsReorder(newQuestions);
  };

  const renderOptions = (options, correctAnswer, language = 'english', qIndex) => {
    const optionElements = options.map((option, index) => (
      <div 
        key={index} 
        className="flex items-start group"
        style={{ 
          fontSize: `${layoutSettings.optionSize || 14}px`,
          lineHeight: layoutSettings.lineSpacing || 1.5
        }}
      >
        <span className="font-medium mr-2">
          ({getOptionLabel(index, language)})
        </span>
        {editingIndex === qIndex && editingField === `option-${index}` ? (
          <textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={saveEdit}
            className="flex-1 px-2 py-1 border border-indigo-500 rounded resize-none"
            style={{ 
              fontSize: `${layoutSettings.optionSize || 14}px`,
              lineHeight: layoutSettings.lineSpacing || 1.5
            }}
            autoFocus
          />
        ) : (
          <span 
            className="flex-1 cursor-text hover:bg-yellow-50 px-1 -mx-1 rounded"
            onDoubleClick={() => startEditing(qIndex, `option-${index}`, option)}
          >
            {option}
          </span>
        )}
      </div>
    ));

    switch (optionLayout) {
      case 'horizontal':
        return (
          <div className="flex flex-wrap gap-x-6 gap-y-2 ml-6">
            {optionElements}
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 ml-6 max-w-2xl">
            {optionElements}
          </div>
        );
      
      case 'vertical':
      default:
        return (
          <div className="space-y-2 ml-6">
            {optionElements}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Interactive Preview (Double-click to edit)
          </h2>
          <div className="text-sm text-gray-600">
            Page {currentPage} | Drag to reorder
          </div>
        </div>
      </div>
      
      <div 
        ref={previewRef}
        id="question-paper-preview" 
        className="bg-white relative"
        style={{ 
          fontFamily: layoutSettings.fontFamily || 'Times New Roman, serif',
          padding: `${layoutSettings.marginSize || 32}px`,
          minHeight: '800px',
          fontSize: layoutSettings.fontSize === 'small' ? '14px' : 
                   layoutSettings.fontSize === 'large' ? '18px' : 
                   layoutSettings.fontSize === 'extra-large' ? '20px' : '16px'
        }}
      >
        {questions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>Your question paper preview will appear here</p>
            <p className="text-sm mt-2">Questions can be edited by double-clicking</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
              <h1 
                className="font-bold mb-2 cursor-text hover:bg-yellow-50 inline-block px-2 -mx-2 rounded"
                style={{ fontSize: `${parseInt(layoutSettings.questionSize || 16) + 8}px` }}
                onDoubleClick={() => {/* Could add paper name editing here */}}
              >
                {paperName || 'QUESTION PAPER'}
              </h1>
              <p className="text-gray-600" style={{ fontSize: `${layoutSettings.optionSize || 14}px` }}>
                Total Questions: {questions.length}
              </p>
            </div>
            
            <div style={{ marginBottom: `${layoutSettings.questionSpacing || 24}px` }}>
              {questions.map((q, index) => (
                <React.Fragment key={index}>
                  {pageBreaks.has(index) && (
                    <div className="page-break my-8 border-t-2 border-dashed border-gray-400 relative">
                      <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-xs text-gray-500">
                        Page Break
                      </span>
                    </div>
                  )}
                  
                  <div 
                    className={`question-item break-inside-avoid relative group ${
                      draggedIndex === index ? 'opacity-50' : ''
                    } ${hoveredQuestion === index ? 'bg-blue-50' : ''}`}
                    style={{ marginBottom: `${layoutSettings.questionSpacing || 24}px` }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onDragEnd={handleDragEnd}
                    onMouseEnter={() => setHoveredQuestion(index)}
                    onMouseLeave={() => setHoveredQuestion(null)}
                  >
                    {/* Drag Handle and Actions */}
                    <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
                      <button 
                        className="p-1 hover:bg-gray-200 rounded cursor-move"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => togglePageBreak(index + 1)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Insert page break after"
                      >
                        <Scissors className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => duplicateQuestion(index)}
                        className="p-1 hover:bg-gray-200 rounded"
                        title="Duplicate question"
                      >
                        <Copy className="h-4 w-4 text-gray-500" />
                      </button>
                      <button 
                        onClick={() => onQuestionDelete(index)}
                        className="p-1 hover:bg-red-100 rounded"
                        title="Delete question"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                    
                    <div className="flex items-start">
                      <span 
                        className="font-bold mr-3"
                        style={{ 
                          fontSize: `${layoutSettings.questionSize || 16}px`,
                          lineHeight: layoutSettings.lineSpacing || 1.5
                        }}
                      >
                        {getQuestionPrefix(q.language)}{index + 1}.
                      </span>
                      <div className="flex-1">
                        {editingIndex === index && editingField === 'question' ? (
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={saveEdit}
                            className="w-full mb-3 px-2 py-1 border border-indigo-500 rounded resize-none"
                            style={{ 
                              fontSize: `${layoutSettings.questionSize || 16}px`,
                              lineHeight: layoutSettings.lineSpacing || 1.5
                            }}
                            rows="2"
                            autoFocus
                          />
                        ) : (
                          <p 
                            className="mb-3 cursor-text hover:bg-yellow-50 px-1 -mx-1 rounded"
                            style={{ 
                              fontSize: `${layoutSettings.questionSize || 16}px`,
                              lineHeight: layoutSettings.lineSpacing || 1.5
                            }}
                            onDoubleClick={() => startEditing(index, 'question', q.question)}
                          >
                            {q.question}
                          </p>
                        )}
                        {renderOptions(q.options, q.correctAnswer, q.language, index)}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
            
            <div className="mt-12 pt-6 border-t-2 border-gray-300">
              <p 
                className="text-center text-gray-600"
                style={{ fontSize: `${layoutSettings.optionSize || 14}px` }}
              >
                *** End of Question Paper ***
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default EnhancedPreview;