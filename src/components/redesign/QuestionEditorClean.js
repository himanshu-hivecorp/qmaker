import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, ChevronRight, ChevronUp, ChevronDown,
  Copy, Eye, EyeOff, Calculator, Globe, Check, X, 
  FileText, Star, AlertCircle, Save, ArrowRight, Layers, Split
} from 'lucide-react';
import MathInput from '../MathInput';
import PageManagerIntegrated from './PageManagerIntegrated';
import { getOptionLabel, getQuestionPrefix } from '../../utils/languageOptions';

function QuestionEditorClean({ projectData, onUpdateQuestions, onUpdateProject, onNext, onBack }) {
  // Use global settings from projectData
  const paperLanguage = projectData.language || 'english';
  const defaultMarks = projectData.defaultMarks || '1';

  const [questions, setQuestions] = useState(projectData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null,
    marks: defaultMarks,
    difficulty: 'medium',
    type: 'mcq'
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showMathInput, setShowMathInput] = useState(false);
  const [mathInputTarget, setMathInputTarget] = useState(null);
  const [mathInputValue, setMathInputValue] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('add');

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

    const questionToAdd = {
      ...currentQuestion,
      language: paperLanguage // Use global language
    };

    if (editingIndex !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingIndex] = questionToAdd;
      setQuestions(updatedQuestions);
      setEditingIndex(null);
    } else {
      setQuestions([...questions, questionToAdd]);
    }

    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: null,
      marks: defaultMarks,
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
    return { totalMarks, byDifficulty };
  };

  const stats = getStatistics();

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Floating Action Buttons - Top Right */}
      <div className="fixed top-20 right-6 z-10 flex flex-col gap-2">
        <button
          onClick={onBack}
          className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
          title="Back to Templates"
        >
          <ChevronRight size={20} className="text-gray-600 rotate-180" />
        </button>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all"
          title={showPreview ? 'Hide Preview' : 'Show Preview'}
        >
          {showPreview ? <EyeOff size={20} className="text-gray-600" /> : <Eye size={20} className="text-gray-600" />}
        </button>
        <button
          onClick={onNext}
          disabled={questions.length === 0}
          className={`p-3 rounded-lg shadow-sm hover:shadow-md transition-all ${
            questions.length > 0 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
          title="Continue to Export"
        >
          <ArrowRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Question Form */}
        <div className="col-span-5">
          <div className="bg-white rounded-xl border border-gray-200 sticky top-4">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <Edit3 size={20} />
                  {editingIndex !== null ? 'Edit Question' : 'Add Question'}
                </h3>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('add')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'add' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Form
                  </button>
                  <button
                    onClick={() => setActiveTab('list')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      activeTab === 'list' 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List ({questions.length})
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6" style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {activeTab === 'add' ? (
                <form onSubmit={(e) => { e.preventDefault(); handleAddQuestion(); }} className="space-y-4">
                  {/* Question Settings */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={currentQuestion.difficulty}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Each question: {defaultMarks} mark{defaultMarks !== '1' ? 's' : ''}</p>
                  </div>

                  {/* Question Text */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Question Text <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <textarea
                        value={currentQuestion.question}
                        onChange={(e) => {
                          setCurrentQuestion({ ...currentQuestion, question: e.target.value });
                          if (errors.question) setErrors({ ...errors, question: '' });
                        }}
                        className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          errors.question ? 'border-red-300' : 'border-gray-200'
                        }`}
                        rows="3"
                        placeholder="Enter your question here..."
                      />
                      <button
                        type="button"
                        onClick={() => openMathInput('question', currentQuestion.question)}
                        className="absolute right-2 top-2 p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                        title="Insert math symbols"
                      >
                        <Calculator size={18} />
                      </button>
                    </div>
                    {errors.question && <p className="text-xs text-red-500 mt-1">{errors.question}</p>}
                  </div>

                  {/* Options */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-2">
                      Options <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs font-bold">
                            {getOptionLabel(index, paperLanguage)}
                          </span>
                          <div className="flex-1 relative">
                            <input
                              type="text"
                              value={option}
                              onChange={(e) => handleOptionChange(index, e.target.value)}
                              className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              placeholder={`Option ${getOptionLabel(index, paperLanguage)}`}
                            />
                            <button
                              type="button"
                              onClick={() => openMathInput(`option-${index}`, option)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                              title="Insert math symbols"
                            >
                              <Calculator size={14} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                            className={`p-2 rounded-lg transition-colors ${
                              currentQuestion.correctAnswer === index
                                ? 'bg-green-500 text-white'
                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                            }`}
                            title="Mark as correct answer"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                    {errors.options && <p className="text-xs text-red-500 mt-1">{errors.options}</p>}
                    {errors.correctAnswer && <p className="text-xs text-red-500 mt-1">{errors.correctAnswer}</p>}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
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
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                      {editingIndex !== null ? 'Update Question' : 'Add Question'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-2">
                  {questions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <FileText size={40} className="mx-auto mb-3" />
                      <p className="text-sm">No questions added yet</p>
                    </div>
                  ) : (
                    questions.map((q, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              Q{index + 1}
                            </span>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                              q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {q.difficulty}
                            </span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveQuestion(index, index - 1)}
                              disabled={index === 0}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <button
                              onClick={() => moveQuestion(index, index + 1)}
                              disabled={index === questions.length - 1}
                              className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                            >
                              <ChevronDown size={14} />
                            </button>
                            <button
                              onClick={() => handleEditQuestion(index)}
                              className="p-1 text-gray-400 hover:text-indigo-600"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(index)}
                              className="p-1 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{q.question}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Stats & Preview */}
        <div className="col-span-7">
          {/* Statistics Bar */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{questions.length}</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalMarks}</div>
                <div className="text-xs text-gray-500">Total Marks</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center gap-1 text-lg font-bold">
                  <span className="text-green-600">{stats.byDifficulty.easy}</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-yellow-600">{stats.byDifficulty.medium}</span>
                  <span className="text-gray-300">/</span>
                  <span className="text-red-600">{stats.byDifficulty.hard}</span>
                </div>
                <div className="text-xs text-gray-500">E / M / H</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {projectData.duration || '--'}
                </div>
                <div className="text-xs text-gray-500">Duration</div>
              </div>
            </div>
          </div>

          {/* Live Preview - A4 Paper Format */}
          {showPreview && (
            <div className="bg-gray-100 rounded-xl p-6 overflow-hidden">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Eye size={18} />
                  Live Preview (A4)
                </h3>
                <span className="text-xs text-gray-500">210mm × 297mm</span>
              </div>
              
              {/* A4 Paper Container */}
              <div className="overflow-auto" style={{ maxHeight: '80vh' }}>
                <div 
                  className="bg-white shadow-lg mx-auto"
                  style={{
                    width: '210mm',
                    minHeight: '297mm',
                    padding: '25mm 20mm',
                    boxSizing: 'border-box',
                    transform: 'scale(0.6)',
                    transformOrigin: 'top center',
                    marginBottom: '-40%',
                    fontFamily: projectData.template?.settings?.fontFamily || 'serif'
                  }}
                >
                  {questions.length === 0 ? (
                    <div className="text-center py-32 text-gray-300">
                      <FileText size={60} className="mx-auto mb-4" />
                      <p className="text-lg">Your question paper preview will appear here</p>
                      <p className="text-sm mt-2">A4 Paper Format</p>
                    </div>
                  ) : (
                    <>
                      {/* Paper Header */}
                      <div className="text-center mb-8 pb-4 border-b-2 border-gray-800">
                        <h1 className="text-3xl font-bold mb-3">
                          {projectData.name || 'Question Paper'}
                        </h1>
                        <div className="text-base text-gray-700">
                          {projectData.subject && <span className="font-semibold">{projectData.subject}</span>}
                          {projectData.class && <span> • Class: {projectData.class}</span>}
                          {stats.totalMarks && <div className="mt-2">Total Marks: {stats.totalMarks} • Duration: {projectData.duration || 'Not specified'}</div>}
                        </div>
                      </div>

                      {/* Instructions Section */}
                      {projectData.instructions && (
                        <div className="mb-8 p-6 border border-gray-300 bg-gray-50">
                          <h3 className="font-bold text-lg mb-3">Instructions:</h3>
                          <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{projectData.instructions}</p>
                        </div>
                      )}

                      {/* Questions Section */}
                      <div className="space-y-6">
                        {questions.map((q, index) => (
                          <div key={index} className="break-inside-avoid">
                            <div className="flex items-start gap-4">
                              <span className="font-bold text-lg">{getQuestionPrefix(q.language || projectData.language || 'english')}{index + 1}.</span>
                              <div className="flex-1">
                                <p className="text-base mb-3 leading-relaxed">{q.question}</p>
                                <div className="ml-6 space-y-2">
                                  {q.options.map((option, optIndex) => (
                                    <p key={optIndex} className="text-base">
                                      <span className="font-semibold">({getOptionLabel(optIndex, q.language || projectData.language || 'english')})</span> {option}
                                    </p>
                                  ))}
                                </div>
                              </div>
                              <span className="text-base font-semibold">[{q.marks}]</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
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

export default QuestionEditorClean;