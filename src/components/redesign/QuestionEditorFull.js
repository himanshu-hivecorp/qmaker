import React, { useState, useEffect } from 'react';
import { 
  Plus, Save, Trash2, Edit3, ChevronRight, ChevronUp, ChevronDown,
  Copy, Eye, EyeOff, Calculator, Globe, Check, X, 
  FileText, Grid, List, Star, AlertCircle, GripVertical,
  Hash, Type, Clock, Award
} from 'lucide-react';
import MathInput from '../MathInput';
import { getOptionLabel, getQuestionPrefix } from '../../utils/languageOptions';

function QuestionEditorFull({ projectData, onUpdateQuestions, onUpdateProject, onNext, onBack }) {
  const [questions, setQuestions] = useState(projectData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null,
    marks: '1',
    language: 'english',
    difficulty: 'medium',
    type: 'mcq'
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showMathInput, setShowMathInput] = useState(false);
  const [mathInputTarget, setMathInputTarget] = useState(null);
  const [mathInputValue, setMathInputValue] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'list'

  useEffect(() => {
    onUpdateQuestions(questions);
  }, [questions]);

  const validateQuestion = () => {
    const newErrors = {};
    if (!currentQuestion.question.trim()) {
      newErrors.question = 'Question text is required';
    }
    if (currentQuestion.options.some(opt => !opt.trim())) {
      newErrors.options = 'All options must be filled';
    }
    if (currentQuestion.correctAnswer === null) {
      newErrors.correctAnswer = 'Please select the correct answer';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddQuestion = () => {
    if (!validateQuestion()) return;

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = currentQuestion;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, currentQuestion]);
    }

    // Reset form
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: null,
      marks: '1',
      language: 'english',
      difficulty: 'medium',
      type: 'mcq'
    });
    setErrors({});
  };

  const handleEditQuestion = (index) => {
    setCurrentQuestion(questions[index]);
    setEditingIndex(index);
    setActiveTab('add');
  };

  const handleDeleteQuestion = (index) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleDuplicateQuestion = (index) => {
    const questionToDuplicate = { ...questions[index] };
    setQuestions([...questions, questionToDuplicate]);
  };

  const moveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };

  const openMathInput = (target, currentValue) => {
    setMathInputTarget(target);
    setMathInputValue(currentValue || '');
    setShowMathInput(true);
  };

  const handleMathInputSave = (value) => {
    if (mathInputTarget === 'question') {
      setCurrentQuestion({ ...currentQuestion, question: value });
    } else if (mathInputTarget && mathInputTarget.startsWith('option-')) {
      const index = parseInt(mathInputTarget.split('-')[1]);
      const newOptions = [...currentQuestion.options];
      newOptions[index] = value;
      setCurrentQuestion({ ...currentQuestion, options: newOptions });
    }
    setShowMathInput(false);
    setMathInputTarget(null);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion({ ...currentQuestion, options: newOptions });
    if (errors.options) {
      setErrors({ ...errors, options: '' });
    }
  };

  const getStatistics = () => {
    const totalMarks = questions.reduce((sum, q) => sum + parseInt(q.marks || 1), 0);
    const byDifficulty = {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    };
    const byLanguage = {
      english: questions.filter(q => q.language === 'english').length,
      hindi: questions.filter(q => q.language === 'hindi').length,
      odia: questions.filter(q => q.language === 'odia').length
    };
    return { totalMarks, byDifficulty, byLanguage };
  };

  const stats = getStatistics();

  return (
    <div className="editor-container" style={{ maxWidth: '1400px', width: '100%' }}>
      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Question Form */}
        <div className="col-span-5">
          <div className="card glass sticky top-4">
            <div className="card-header border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Edit3 size={24} />
                  {editingIndex !== null ? 'Edit Question' : 'Add New Question'}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('add')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'add' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === 'list' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    List ({questions.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="card-body" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {activeTab === 'add' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }}>
                  {/* Question Type and Settings */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="input-group">
                      <label className="input-label flex items-center gap-1">
                        <Globe size={14} />
                        Language
                      </label>
                      <select
                        value={currentQuestion.language}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, language: e.target.value })}
                        className="input-field"
                      >
                        <option value="english">English</option>
                        <option value="hindi">Hindi</option>
                        <option value="odia">Odia</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label className="input-label flex items-center gap-1">
                        <Award size={14} />
                        Marks
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={currentQuestion.marks}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, marks: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label flex items-center gap-1">
                        <Star size={14} />
                        Difficulty
                      </label>
                      <select
                        value={currentQuestion.difficulty}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                        className="input-field"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                  </div>

                  {/* Question Text */}
                  <div className="input-group">
                    <label className="input-label">
                      Question Text <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => {
                          setCurrentQuestion({ ...currentQuestion, question: e.target.value });
                          if (errors.question) setErrors({ ...errors, question: '' });
                        }}
                        className={`input-field pr-10 ${errors.question ? 'input-error' : ''}`}
                        rows="3"
                        placeholder="Enter your question here..."
                      />
                      <button
                        type="button"
                        onClick={() => openMathInput('question', currentQuestion.question)}
                        className="absolute right-2 top-2 p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        title="Insert math symbols"
                      >
                        <Calculator size={20} />
                      </button>
                    </div>
                    {errors.question && <div className="input-error-message">{errors.question}</div>}
                  </div>

                  {/* Options */}
                  <div className="input-group">
                    <label className="input-label">
                      Options <span className="text-danger">*</span>
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm font-bold">
                            {getOptionLabel(index, currentQuestion.language)}
                          </span>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="input-field pr-10"
                              placeholder={`Option ${getOptionLabel(index, currentQuestion.language)}`}
                            />
                            <button
                              type="button"
                              onClick={() => openMathInput(`option-${index}`, option)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                              title="Insert math symbols"
                            >
                              <Calculator size={16} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                            className={`p-2 rounded-lg transition-colors ${
                              currentQuestion.correctAnswer === index
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                            title="Mark as correct answer"
                          >
                            <Check size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.options && <div className="input-error-message">{errors.options}</div>}
                    {errors.correctAnswer && <div className="input-error-message">{errors.correctAnswer}</div>}
                    {currentQuestion.correctAnswer !== null && (
                      <p className="mt-2 text-sm text-green-600 flex items-center gap-1">
                        <Check size={16} />
                        Correct answer: Option {getOptionLabel(currentQuestion.correctAnswer, currentQuestion.language)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    {editingIndex !== null && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingIndex(null);
                          setCurrentQuestion({
                            question: '',
                            options: ['', '', '', ''],
                            correctAnswer: null,
                            marks: '1',
                            language: 'english',
                            difficulty: 'medium',
                            type: 'mcq'
                          });
                        }}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary flex-1"
                    >
                      {editingIndex !== null ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No questions added yet</p>
                      <button
                        onClick={() => setActiveTab('add')}
                        className="btn btn-primary btn-sm mt-4"
                      >
                        Add First Question
                      </button>
                    </div>
                  ) : (
                    questions.map((q, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                              {getQuestionPrefix(q.language)}{index + 1}
                            </span>
                            <span className={`
                              px-2 py-1 rounded text-xs font-medium
                              ${q.difficulty === 'easy' ? 'bg-green-100 text-green-700' : ''}
                              ${q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : ''}
                              ${q.difficulty === 'hard' ? 'bg-red-100 text-red-700' : ''}
                            `}>
                              {q.difficulty}
                            </span>
                            <span className="text-xs text-gray-500">{q.marks} marks</span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveQuestion(index, index - 1)}
                              disabled={index === 0}
                              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                              <ChevronUp size={16} />
                            </button>
                            <button
                              onClick={() => moveQuestion(index, index + 1)}
                              disabled={index === questions.length - 1}
                              className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                            >
                              <ChevronDown size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicateQuestion(index)}
                              className="p-1 text-gray-500 hover:text-blue-600"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => handleEditQuestion(index)}
                              className="p-1 text-gray-500 hover:text-indigo-600"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(index)}
                              className="p-1 text-gray-500 hover:text-red-600"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-800 font-medium mb-2 line-clamp-2">
                          {q.question}
                        </p>
                        <div className="grid grid-cols-2 gap-1 text-xs">
                          {q.options.map((opt, optIndex) => (
                            <div
                              key={optIndex}
                              className={`flex items-center gap-1 ${
                                q.correctAnswer === optIndex ? 'text-green-600 font-bold' : 'text-gray-600'
                              }`}
                            >
                              <span>{getOptionLabel(optIndex, q.language)}.</span>
                              <span className="truncate">{opt}</span>
                              {q.correctAnswer === optIndex && <Check size={12} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview & Statistics */}
        <div className="col-span-7">
          {/* Statistics Bar */}
          <div className="card glass mb-4">
            <div className="card-body p-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-600">{questions.length}</div>
                  <div className="text-xs text-gray-600">Total Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.totalMarks}</div>
                  <div className="text-xs text-gray-600">Total Marks</div>
                </div>
                <div className="text-center">
                  <div className="flex justify-center gap-1">
                    <span className="text-sm font-bold text-green-600">{stats.byDifficulty.easy}</span>
                    <span className="text-sm font-bold text-yellow-600">{stats.byDifficulty.medium}</span>
                    <span className="text-sm font-bold text-red-600">{stats.byDifficulty.hard}</span>
                  </div>
                  <div className="text-xs text-gray-600">E / M / H</div>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="btn btn-sm btn-outline flex items-center gap-1 mx-auto"
                  >
                    {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
                    {showPreview ? 'Hide' : 'Show'} Preview
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          {showPreview && (
            <div className="card glass">
              <div className="card-header bg-gradient-to-r from-gray-50 to-gray-100">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Eye size={20} />
                  Live Preview
                </h3>
              </div>
              <div 
                className="card-body"
                style={{ 
                  maxHeight: '600px', 
                  overflowY: 'auto',
                  fontFamily: projectData.template?.settings?.fontFamily || 'serif'
                }}
              >
                {questions.length === 0 ? (
                  <div className="text-center py-16 text-gray-400">
                    <FileText size={48} className="mx-auto mb-4" />
                    <p>Your question paper preview will appear here</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6 pb-4 border-b-2 border-gray-300">
                      <h1 className="text-2xl font-bold mb-2">
                        {projectData.name || 'Question Paper'}
                      </h1>
                      <p className="text-sm text-gray-600">
                        {projectData.subject} • {projectData.class}
                        {projectData.totalMarks && ` • Total Marks: ${stats.totalMarks}`}
                        {projectData.duration && ` • Duration: ${projectData.duration}`}
                      </p>
                    </div>

                    {projectData.instructions && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-bold mb-2">Instructions:</h3>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{projectData.instructions}</p>
                      </div>
                    )}

                    <div className="space-y-6">
                      {questions.map((q, index) => (
                        <div key={index} className="break-inside-avoid">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-3">
                                <span className="font-bold">
                                  {getQuestionPrefix(q.language)}{index + 1}.
                                </span>
                                <p className="flex-1">{q.question}</p>
                                <span className="text-sm text-gray-600">[{q.marks} marks]</span>
                              </div>
                              <div className="ml-8 space-y-1">
                                {q.options.map((option, optIndex) => (
                                  <div key={optIndex} className="flex items-start gap-2">
                                    <span className="font-medium">
                                      ({getOptionLabel(optIndex, q.language)})
                                    </span>
                                    <span>{option}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="card glass mt-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="badge badge-primary">
              Step 3 of 4
            </div>
            <div>
              <h4 className="font-semibold">{projectData.name}</h4>
              <p className="text-sm text-muted">
                {questions.length} questions • {stats.totalMarks} marks
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={onBack} className="btn btn-outline">
              Back
            </button>
            <button 
              onClick={onNext} 
              disabled={questions.length === 0}
              className="btn btn-primary btn-lg"
            >
              Review & Export
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Math Input Modal */}
      {showMathInput && (
        <MathInput
          value={mathInputValue}
          onChange={handleMathInputSave}
          onClose={() => setShowMathInput(false)}
        />
      )}
    </div>
  );
}

export default QuestionEditorFull;