import React, { useState, useEffect } from 'react';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import Preview from './components/Preview';
import EnhancedPreview from './components/EnhancedPreview';
import ExportButtons from './components/ExportButtons';
import LayoutControls from './components/LayoutControls';
import SaveLoadWork from './components/SaveLoadWork';
import { FileText, Layout, List, Settings, Eye } from 'lucide-react';

function App() {
  const [questions, setQuestions] = useState([]);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [optionLayout, setOptionLayout] = useState('vertical');
  const [activeTab, setActiveTab] = useState('form');
  const [paperName, setPaperName] = useState('Question Paper');
  const [showLayoutControls, setShowLayoutControls] = useState(false);
  const [useEnhancedPreview, setUseEnhancedPreview] = useState(true);
  const [layoutSettings, setLayoutSettings] = useState({
    fontSize: 'medium',
    questionSize: '16',
    optionSize: '14',
    fontFamily: 'serif',
    lineSpacing: '1.5',
    questionSpacing: '24',
    marginSize: '32'
  });

  useEffect(() => {
    const savedQuestions = localStorage.getItem('questions');
    const savedPaperName = localStorage.getItem('paperName');
    const savedLayoutSettings = localStorage.getItem('layoutSettings');
    if (savedQuestions) {
      setQuestions(JSON.parse(savedQuestions));
    }
    if (savedPaperName) {
      setPaperName(savedPaperName);
    }
    if (savedLayoutSettings) {
      setLayoutSettings(JSON.parse(savedLayoutSettings));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('questions', JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem('paperName', paperName);
  }, [paperName]);

  useEffect(() => {
    localStorage.setItem('layoutSettings', JSON.stringify(layoutSettings));
  }, [layoutSettings]);

  const addQuestion = (question) => {
    if (editingQuestion !== null) {
      const updatedQuestions = [...questions];
      updatedQuestions[editingQuestion] = question;
      setQuestions(updatedQuestions);
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, question]);
    }
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const editQuestion = (index) => {
    setEditingQuestion(index);
    setActiveTab('form');
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
  };

  const moveQuestion = (fromIndex, toIndex) => {
    if (toIndex < 0 || toIndex >= questions.length) return;
    const updatedQuestions = [...questions];
    const [movedQuestion] = updatedQuestions.splice(fromIndex, 1);
    updatedQuestions.splice(toIndex, 0, movedQuestion);
    setQuestions(updatedQuestions);
  };

  const handleQuestionEdit = (index, updatedQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updatedQuestion;
    setQuestions(newQuestions);
  };

  const handleLoadWork = (workData) => {
    if (workData.questions) setQuestions(workData.questions);
    if (workData.paperName) setPaperName(workData.paperName);
    if (workData.layoutSettings) setLayoutSettings(workData.layoutSettings);
    if (workData.optionLayout) setOptionLayout(workData.optionLayout);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-indigo-600" />
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-gray-900">Question Paper Generator</h1>
                <input
                  type="text"
                  value={paperName}
                  onChange={(e) => setPaperName(e.target.value)}
                  className="mt-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter paper name"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <SaveLoadWork
                questions={questions}
                paperName={paperName}
                layoutSettings={layoutSettings}
                optionLayout={optionLayout}
                onLoad={handleLoadWork}
              />
              
              <button
                onClick={() => setUseEnhancedPreview(!useEnhancedPreview)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Toggle preview mode"
              >
                <Eye className="h-4 w-4 text-gray-600" />
                <span className="text-sm hidden sm:inline">
                  {useEnhancedPreview ? 'Interactive' : 'Simple'}
                </span>
              </button>
              
              <button
                onClick={() => setShowLayoutControls(!showLayoutControls)}
                className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                title="Layout Settings"
              >
                <Settings className="h-4 w-4 text-gray-600" />
                <span className="text-sm hidden sm:inline">Layout</span>
              </button>
              <div className="flex items-center space-x-2">
                <Layout className="h-5 w-5 text-gray-500" />
                <select
                  value={optionLayout}
                  onChange={(e) => setOptionLayout(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="vertical">Vertical</option>
                  <option value="horizontal">Horizontal</option>
                  <option value="grid">Grid (2x2)</option>
                </select>
              </div>
              {questions.length > 0 && <ExportButtons questions={questions} optionLayout={optionLayout} paperName={paperName} layoutSettings={layoutSettings} />}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showLayoutControls && (
          <div className="mb-6">
            <LayoutControls 
              settings={layoutSettings} 
              onSettingsChange={setLayoutSettings}
              onClose={() => setShowLayoutControls(false)}
            />
          </div>
        )}
        <div className="lg:hidden mb-4">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('form')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'form'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Add Question
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'list'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Questions ({questions.length})
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preview
              </button>
            </nav>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className={`lg:col-span-3 ${activeTab === 'form' ? 'block' : 'hidden lg:block'}`}>
            <QuestionForm
              onAddQuestion={addQuestion}
              editingQuestion={editingQuestion !== null ? questions[editingQuestion] : null}
              onCancelEdit={cancelEdit}
            />
          </div>

          <div className={`lg:col-span-3 ${activeTab === 'list' ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <List className="h-5 w-5 mr-2" />
                  Questions ({questions.length})
                </h2>
              </div>
              <QuestionList
                questions={questions}
                onEdit={editQuestion}
                onDelete={deleteQuestion}
                onMove={moveQuestion}
              />
            </div>
          </div>

          <div className={`lg:col-span-6 ${activeTab === 'preview' ? 'block' : 'hidden lg:block'}`}>
            {useEnhancedPreview ? (
              <EnhancedPreview 
                questions={questions} 
                optionLayout={optionLayout} 
                paperName={paperName}
                layoutSettings={layoutSettings}
                onQuestionsReorder={setQuestions}
                onQuestionEdit={handleQuestionEdit}
                onQuestionDelete={deleteQuestion}
              />
            ) : (
              <Preview 
                questions={questions} 
                optionLayout={optionLayout} 
                paperName={paperName}
                layoutSettings={layoutSettings}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;