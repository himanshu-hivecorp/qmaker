import React, { useState, useEffect } from 'react';
import { 
  Layers, Settings, ChevronUp, ChevronDown, Info,
  Split, FileText, ToggleLeft, ToggleRight
} from 'lucide-react';

function PageManagerIntegrated({ questions, onUpdateQuestions, projectData, onUpdateProject }) {
  const [pageMode, setPageMode] = useState(projectData.pageSettings?.mode || 'auto');
  const [questionsPerPage, setQuestionsPerPage] = useState(projectData.pageSettings?.questionsPerPage || 10);
  const [pages, setPages] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate pages based on mode
  useEffect(() => {
    if (pageMode === 'auto') {
      // Automatic pagination
      const newPages = [];
      for (let i = 0; i < questions.length; i += questionsPerPage) {
        newPages.push({
          id: `page-${Math.floor(i / questionsPerPage) + 1}`,
          questions: questions.slice(i, Math.min(i + questionsPerPage, questions.length)),
          pageNumber: Math.floor(i / questionsPerPage) + 1,
          startIndex: i,
          endIndex: Math.min(i + questionsPerPage - 1, questions.length - 1)
        });
      }
      setPages(newPages);
    } else {
      // Manual pagination based on page breaks
      const newPages = [];
      let currentPageQuestions = [];
      let pageNumber = 1;
      let startIndex = 0;

      questions.forEach((question, index) => {
        currentPageQuestions.push(question);
        
        if (question.pageBreak || index === questions.length - 1) {
          newPages.push({
            id: `page-${pageNumber}`,
            questions: [...currentPageQuestions],
            pageNumber: pageNumber,
            startIndex: startIndex,
            endIndex: index,
            hasPageBreak: question.pageBreak
          });
          startIndex = index + 1;
          currentPageQuestions = [];
          pageNumber++;
        }
      });

      if (newPages.length === 0 && questions.length > 0) {
        newPages.push({
          id: 'page-1',
          questions: [...questions],
          pageNumber: 1,
          startIndex: 0,
          endIndex: questions.length - 1
        });
      }

      setPages(newPages);
    }
  }, [questions, pageMode, questionsPerPage]);

  const handlePageModeChange = (mode) => {
    setPageMode(mode);
    onUpdateProject({
      ...projectData,
      pageSettings: {
        ...projectData.pageSettings,
        mode: mode,
        questionsPerPage: questionsPerPage
      }
    });
  };

  const handleQuestionsPerPageChange = (value) => {
    const num = parseInt(value) || 10;
    setQuestionsPerPage(num);
    onUpdateProject({
      ...projectData,
      pageSettings: {
        ...projectData.pageSettings,
        questionsPerPage: num
      }
    });
  };

  const insertPageBreakAfter = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      pageBreak: true
    };
    onUpdateQuestions(updatedQuestions);
  };

  const removePageBreak = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      pageBreak: false
    };
    onUpdateQuestions(updatedQuestions);
  };

  const getTotalPages = () => pages.length || 1;

  return (
    <div className="bg-white rounded-xl border border-gray-200 mt-4">
      {/* Header Bar */}
      <div 
        className="px-4 py-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-indigo-600" />
            <span className="font-medium text-gray-900">Page Management</span>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                {getTotalPages()} {getTotalPages() === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {questions.length} Questions
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Quick Mode Toggle */}
            <div className="flex items-center gap-2 mr-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageModeChange('auto');
                }}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  pageMode === 'auto' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Auto
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePageModeChange('manual');
                }}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  pageMode === 'manual' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Manual
              </button>
            </div>
            
            <ChevronUp 
              size={16} 
              className={`text-gray-400 transition-transform ${isExpanded ? '' : 'rotate-180'}`}
            />
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Mode-specific Controls */}
          {pageMode === 'auto' ? (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info size={14} className="text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Automatic Mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-blue-700">Questions per page:</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleQuestionsPerPageChange(Math.max(1, questionsPerPage - 1))}
                      className="p-1 bg-white hover:bg-blue-100 rounded transition-colors"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={questionsPerPage}
                      onChange={(e) => handleQuestionsPerPageChange(e.target.value)}
                      className="w-12 px-2 py-1 text-center border border-blue-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => handleQuestionsPerPageChange(Math.min(50, questionsPerPage + 1))}
                      className="p-1 bg-white hover:bg-blue-100 rounded transition-colors"
                    >
                      <ChevronUp size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Split size={14} className="text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Manual Mode</span>
                </div>
                <span className="text-xs text-purple-700">
                  Click page break buttons in the question list to create page divisions
                </span>
              </div>
            </div>
          )}

          {/* Page Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Page Distribution</h4>
            <div className="grid grid-cols-3 gap-2">
              {pages.map((page) => (
                <div 
                  key={page.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-2 text-center"
                >
                  <div className="text-xs font-medium text-gray-900">Page {page.pageNumber}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Q{page.startIndex + 1}-{page.endIndex + 1}
                  </div>
                  <div className="text-xs text-gray-500">
                    ({page.questions.length} items)
                  </div>
                  {page.hasPageBreak && pageMode === 'manual' && (
                    <Split size={10} className="text-purple-600 mx-auto mt-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Manual Page Break Helper */}
          {pageMode === 'manual' && questions.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="text-xs font-medium text-gray-700 mb-2">Quick Actions</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    // Add page break after every 5 questions
                    const updatedQuestions = [...questions];
                    for (let i = 4; i < questions.length; i += 5) {
                      updatedQuestions[i] = { ...updatedQuestions[i], pageBreak: true };
                    }
                    onUpdateQuestions(updatedQuestions);
                  }}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  Break every 5 questions
                </button>
                <button
                  onClick={() => {
                    // Add page break after every 10 questions
                    const updatedQuestions = [...questions];
                    for (let i = 9; i < questions.length; i += 10) {
                      updatedQuestions[i] = { ...updatedQuestions[i], pageBreak: true };
                    }
                    onUpdateQuestions(updatedQuestions);
                  }}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
                >
                  Break every 10 questions
                </button>
                <button
                  onClick={() => {
                    // Clear all page breaks
                    const updatedQuestions = questions.map(q => ({ ...q, pageBreak: false }));
                    onUpdateQuestions(updatedQuestions);
                  }}
                  className="px-3 py-1 bg-white border border-red-300 text-red-600 rounded text-xs hover:bg-red-50"
                >
                  Clear all breaks
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PageManagerIntegrated;