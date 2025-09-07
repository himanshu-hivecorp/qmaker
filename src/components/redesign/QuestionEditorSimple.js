import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit3, ChevronRight, ChevronUp, ChevronDown,
  Copy, Eye, EyeOff, Calculator, Check, X, 
  FileText, Star, ArrowRight, Globe, Layers, Split,
  Save, Download, Upload
} from 'lucide-react';
import MathInput from '../MathInput';
import PageManagerIntegrated from './PageManagerIntegrated';
import { getOptionLabel, getQuestionPrefix } from '../../utils/languageOptions';

function QuestionEditorSimple({ projectData, onUpdateQuestions, onUpdateProject, onNext, onBack }) {
  const [questions, setQuestions] = useState(projectData.questions || []);
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: null,
    marks: projectData.mode === 'professional' ? (projectData.defaultMarks || '1') : null,
    difficulty: projectData.mode === 'professional' ? 'medium' : null,
    type: 'mcq'
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [showPreview, setShowPreview] = useState(true);
  const [showMathInput, setShowMathInput] = useState(false);
  const [mathInputTarget, setMathInputTarget] = useState(null);
  const [mathInputValue, setMathInputValue] = useState('');
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('add');
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', ''
  const [lastSaved, setLastSaved] = useState(null);

  // Use global settings from projectData
  const [paperLanguage, setPaperLanguage] = useState(projectData.language || localStorage.getItem('qpg_language') || 'english');
  const isProfessional = projectData.mode === 'professional';
  const defaultMarks = projectData.defaultMarks || '1';
  const [optionLayout, setOptionLayout] = useState(projectData.optionLayout || localStorage.getItem('qpg_layout') || 'vertical');
  
  // Listen for settings changes
  useEffect(() => {
    const handleSettingsChange = () => {
      const newLanguage = localStorage.getItem('qpg_language') || 'english';
      const newLayout = localStorage.getItem('qpg_layout') || 'vertical';
      setPaperLanguage(newLanguage);
      setOptionLayout(newLayout);
    };
    
    window.addEventListener('settingsChanged', handleSettingsChange);
    return () => window.removeEventListener('settingsChanged', handleSettingsChange);
  }, []);
  
  // Update when projectData changes
  useEffect(() => {
    if (projectData.language) {
      setPaperLanguage(projectData.language);
    }
    if (projectData.optionLayout) {
      setOptionLayout(projectData.optionLayout);
    }
  }, [projectData.language, projectData.optionLayout]);

  // Auto-save effect with localStorage - optimized to reduce re-renders
  useEffect(() => {
    // Only save if questions have actually changed
    if (questions.length === 0 && (!projectData.questions || projectData.questions.length === 0)) {
      return;
    }

    const saveToLocalStorage = () => {
      const projectToSave = {
        ...projectData,
        questions: questions,
        lastModified: new Date().toISOString()
      };
      localStorage.setItem('questionPaperProject', JSON.stringify(projectToSave));
      setLastSaved(new Date());
    };

    // Debounce the save operation to prevent too frequent saves
    const saveTimer = setTimeout(saveToLocalStorage, 2000);
    return () => clearTimeout(saveTimer);
  }, [questions]);

  // Update parent component separately without triggering re-renders
  useEffect(() => {
    onUpdateQuestions(questions);
  }, [questions, onUpdateQuestions]);

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
      language: paperLanguage // Always use the global language
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
      marks: isProfessional ? defaultMarks : null,
      difficulty: isProfessional ? 'medium' : null,
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
    const totalMarks = isProfessional 
      ? questions.reduce((sum, q) => sum + parseInt(q.marks || defaultMarks || 1), 0)
      : null;
    const byDifficulty = isProfessional ? {
      easy: questions.filter(q => q.difficulty === 'easy').length,
      medium: questions.filter(q => q.difficulty === 'medium').length,
      hard: questions.filter(q => q.difficulty === 'hard').length
    } : { easy: 0, medium: 0, hard: 0 };
    return { totalMarks, byDifficulty };
  };

  const stats = getStatistics();

  const getLanguageLabel = () => {
    switch(paperLanguage) {
      case 'hindi': return 'हिन्दी';
      case 'odia': return 'ଓଡ଼ିଆ';
      default: return 'English';
    }
  };

  // Save project to localStorage manually
  const handleSaveProject = () => {
    const projectToSave = {
      ...projectData,
      questions: questions,
      lastModified: new Date().toISOString()
    };
    localStorage.setItem('questionPaperProject', JSON.stringify(projectToSave));
    setSaveStatus('saved');
    setLastSaved(new Date());
    setTimeout(() => setSaveStatus(''), 2000);
  };

  // Download project as JSON file
  const handleDownloadProject = () => {
    const projectToDownload = {
      ...projectData,
      questions: questions,
      lastModified: new Date().toISOString(),
      version: '1.0'
    };
    
    const dataStr = JSON.stringify(projectToDownload, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `project_${projectData.name || 'question_paper'}_${new Date().getTime()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Load project from file
  const handleLoadProject = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const loadedProject = JSON.parse(e.target.result);
          if (loadedProject.questions) {
            setQuestions(loadedProject.questions);
            // Only update project data if onUpdateProject is provided
            if (onUpdateProject) {
              onUpdateProject(loadedProject);
            }
            setSaveStatus('loaded');
            setTimeout(() => setSaveStatus(''), 2000);
          }
        } catch (error) {
          console.error('Error loading project:', error);
          alert('Error loading project file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow loading the same file again
    event.target.value = '';
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Floating Action Buttons */}
      <div className="fixed top-20 right-6 z-10 flex flex-col gap-2">
        {/* Save Button */}
        <button
          onClick={handleSaveProject}
          className={`p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all group relative ${
            saveStatus === 'saved' ? 'border-green-500' : 'border-gray-200'
          }`}
          title="Save Project"
        >
          <Save size={20} className={`${
            saveStatus === 'saved' ? 'text-green-600' : 'text-gray-600 group-hover:text-green-600'
          }`} />
          {saveStatus === 'saved' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
          )}
        </button>
        
        {/* Download Button */}
        <button
          onClick={handleDownloadProject}
          className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all group"
          title="Download Project"
        >
          <Download size={20} className="text-gray-600 group-hover:text-blue-600" />
        </button>
        
        {/* Load Button */}
        <label className={`p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer group relative ${
          saveStatus === 'loaded' ? 'border-purple-500' : 'border-gray-200'
        }`}
          title="Load Project">
          <Upload size={20} className={`${
            saveStatus === 'loaded' ? 'text-purple-600' : 'text-gray-600 group-hover:text-purple-600'
          }`} />
          {saveStatus === 'loaded' && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full animate-ping"></span>
          )}
          <input
            type="file"
            accept=".json"
            onChange={handleLoadProject}
            className="hidden"
          />
        </label>
        
        <div className="h-px bg-gray-300 my-1"></div>
        
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
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Edit3 size={20} />
                    {editingIndex !== null ? 'Edit Question' : 'Add Question'}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Globe size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-600">
                      Language: <span className="font-medium">{getLanguageLabel()}</span>
                    </span>
                  </div>
                </div>
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
                  {/* Question Settings - Only show Difficulty in Professional mode */}
                  {isProfessional && (
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
                  )}

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
                    {currentQuestion.correctAnswer !== null && (
                      <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
                        <Check size={14} />
                        Correct answer: Option {getOptionLabel(currentQuestion.correctAnswer, paperLanguage)}
                      </p>
                    )}
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
                            marks: isProfessional ? '1' : null,
                            difficulty: isProfessional ? 'medium' : null,
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
                      <React.Fragment key={index}>
                      <div
                        className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">
                              {getQuestionPrefix(paperLanguage)}{index + 1}
                            </span>
                            {isProfessional && (
                              <>
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  q.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                  q.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {q.difficulty}
                                </span>
                                <span className="text-xs text-gray-500">{q.marks} marks</span>
                              </>
                            )}
                            {q.pageBreak && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                Page Break
                              </span>
                            )}
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
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index] = {
                                  ...updatedQuestions[index],
                                  pageBreak: !updatedQuestions[index].pageBreak
                                };
                                setQuestions(updatedQuestions);
                              }}
                              className={`p-1 ${q.pageBreak ? 'text-purple-600' : 'text-gray-400'} hover:text-purple-700`}
                              title="Page Break After This Question"
                            >
                              <Split size={14} />
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
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            Answer: {getOptionLabel(q.correctAnswer, paperLanguage)}
                          </span>
                        </div>
                      </div>
                      {/* Page Break Button/Indicator Between Questions */}
                      {index < questions.length - 1 && (
                        q.pageBreak ? (
                          <div className="my-3 relative">
                            <div className="border-t-2 border-dashed border-purple-400"></div>
                            <button
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index] = {
                                  ...updatedQuestions[index],
                                  pageBreak: false
                                };
                                setQuestions(updatedQuestions);
                              }}
                              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-600 text-white px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-purple-700 transition-colors"
                            >
                              <Split size={12} />
                              Page Break Active (Click to Remove)
                            </button>
                          </div>
                        ) : (
                          <div className="my-2 flex justify-center">
                            <button
                              onClick={() => {
                                const updatedQuestions = [...questions];
                                updatedQuestions[index] = {
                                  ...updatedQuestions[index],
                                  pageBreak: true
                                };
                                setQuestions(updatedQuestions);
                              }}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs flex items-center gap-1 hover:bg-purple-100 hover:text-purple-700 transition-all"
                            >
                              <Split size={12} />
                              Insert Page Break Here
                            </button>
                          </div>
                        )
                      )}
                    </React.Fragment>
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
            <div className={`grid ${isProfessional ? 'grid-cols-4' : 'grid-cols-2'} gap-4`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">{questions.length}</div>
                <div className="text-xs text-gray-500">Questions</div>
              </div>
              {isProfessional && (
                <>
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
                </>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-800">
                  {getLanguageLabel()}
                </div>
                <div className="text-xs text-gray-500">Language</div>
              </div>
            </div>
            {/* Auto-save indicator */}
            {lastSaved && (
              <div className="mt-2 text-center text-xs text-gray-500">
                Auto-saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </div>

          {/* Live Preview - A4 Paper Format */}
          {showPreview && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <div className="px-4 py-3 bg-white border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Eye size={16} />
                    <span>Live Preview</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">A4</span>
                    <span className="text-xs bg-indigo-100 px-2 py-0.5 rounded text-indigo-600 capitalize">
                      {optionLayout} Layout
                    </span>
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{questions.length} Questions</span>
                    {isProfessional && stats.totalMarks && (
                      <span>{stats.totalMarks} Marks</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* A4 Paper Container with Auto-fit */}
              <div 
                className="p-4 overflow-auto"
                style={{ 
                  height: 'calc(100vh - 300px)',
                  minHeight: '400px',
                  maxHeight: '800px'
                }}
              >
                <div 
                  className="bg-white shadow-xl mx-auto relative"
                  style={{
                    width: '100%',
                    maxWidth: '595px', // A4 width at 72dpi
                    aspectRatio: '210 / 297', // A4 aspect ratio
                    padding: '40px',
                    boxSizing: 'border-box',
                    fontFamily: projectData.template?.settings?.fontFamily || 'Inter, sans-serif',
                    fontSize: '11px',
                    lineHeight: '1.5',
                    color: '#1f2937'
                  }}
                >
                  {questions.length === 0 ? (
                    <div className="text-center py-32 text-gray-300">
                      <FileText size={60} className="mx-auto mb-4" />
                      <p className="text-lg">Your question paper preview will appear here</p>
                      <p className="text-sm mt-2">A4 Paper Format</p>
                    </div>
                  ) : (
                    <div style={{ fontSize: 'inherit', lineHeight: 'inherit' }}>
                      {/* Paper Header */}
                      <div className="text-center mb-4 pb-2 border-b-2 border-gray-700">
                        <h1 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>
                          {projectData.name || 'Question Paper'}
                        </h1>
                        {isProfessional && (
                          <div style={{ fontSize: '10px', color: '#4b5563' }}>
                            {projectData.subject && <span style={{ fontWeight: '600' }}>{projectData.subject}</span>}
                            {projectData.class && <span> • Class: {projectData.class}</span>}
                            {stats.totalMarks && (
                              <div style={{ marginTop: '4px' }}>
                                Total Marks: {stats.totalMarks} • Duration: {projectData.duration || 'Not specified'}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Instructions Section */}
                      {isProfessional && projectData.instructions && (
                        <div style={{ 
                          marginBottom: '16px', 
                          padding: '12px', 
                          border: '1px solid #d1d5db',
                          backgroundColor: '#f9fafb',
                          borderRadius: '4px'
                        }}>
                          <h3 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>Instructions:</h3>
                          <p style={{ fontSize: '10px', color: '#374151', whiteSpace: 'pre-wrap' }}>
                            {projectData.instructions}
                          </p>
                        </div>
                      )}

                      {/* Questions Section */}
                      <div style={{ fontSize: '11px' }}>
                        {questions.map((q, index) => (
                          <div key={index} style={{ 
                            marginBottom: '16px',
                            breakInside: 'avoid',
                            pageBreakInside: 'avoid'
                          }}>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <span style={{ fontWeight: 'bold', flexShrink: 0 }}>
                                {getQuestionPrefix(paperLanguage)}{index + 1}.
                              </span>
                              <div style={{ flex: 1 }}>
                                <p style={{ marginBottom: '8px', lineHeight: '1.4' }}>{q.question}</p>
                                <div style={{ 
                                  paddingLeft: '16px',
                                  display: optionLayout === 'horizontal' ? 'flex' : 
                                          optionLayout === 'grid' ? 'grid' : 'block',
                                  gridTemplateColumns: optionLayout === 'grid' ? 'repeat(2, 1fr)' : 'none',
                                  gap: optionLayout === 'horizontal' ? '16px' : 
                                       optionLayout === 'grid' ? '8px' : '0',
                                  flexWrap: optionLayout === 'horizontal' ? 'wrap' : 'nowrap'
                                }}>
                                  {q.options.map((option, optIndex) => (
                                    <div key={optIndex} style={{ 
                                      marginBottom: optionLayout === 'vertical' ? '4px' : '2px',
                                      flex: optionLayout === 'horizontal' ? '0 0 calc(50% - 8px)' : 'none'
                                    }}>
                                      <span style={{ fontWeight: '500' }}>
                                        ({getOptionLabel(optIndex, paperLanguage)})
                                      </span>
                                      {' '}{option}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              {isProfessional && q.marks && (
                                <span style={{ fontWeight: 'bold', fontSize: '10px' }}>[{q.marks}]</span>
                              )}
                            </div>
                            {/* Page Break Indicator */}
                            {q.pageBreak && index < questions.length - 1 && (
                              <div style={{
                                marginTop: '16px',
                                paddingTop: '16px',
                                borderTop: '2px dashed #9333ea',
                                textAlign: 'center'
                              }}>
                                <span style={{ 
                                  fontSize: '9px', 
                                  color: '#9333ea',
                                  backgroundColor: 'white',
                                  padding: '0 8px',
                                  position: 'relative',
                                  top: '-24px'
                                }}>
                                  Page Break
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Page Manager - Below Live Preview */}
          <PageManagerIntegrated 
            questions={questions}
            onUpdateQuestions={setQuestions}
            projectData={projectData}
            onUpdateProject={onUpdateProject}
          />
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

export default QuestionEditorSimple;