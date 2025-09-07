import React, { useState, useEffect } from 'react';
import { 
  Layers, Settings, X, Info, ChevronUp, ChevronDown,
  Split, FileText, Check
} from 'lucide-react';

function PageManagerCompact({ questions, onUpdateQuestions, projectData, onUpdateProject }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pageMode, setPageMode] = useState(projectData.pageSettings?.mode || 'auto');
  const [questionsPerPage, setQuestionsPerPage] = useState(projectData.pageSettings?.questionsPerPage || 10);
  const [pages, setPages] = useState([]);

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
            hasPageBreak: true
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

  const getTotalPages = () => pages.length || 1;

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative p-4 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 ${
            isOpen ? 'rotate-45' : ''
          }`}
          title="Page Management"
        >
          <Layers size={24} className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
          
          {/* Badge showing page count */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            {getTotalPages()}
          </span>

          {/* Tooltip on hover when closed */}
          {!isOpen && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              Page Management
              <div className="text-xs mt-1 text-gray-300">
                {getTotalPages()} page{getTotalPages() !== 1 ? 's' : ''} • {questions.length} question{questions.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Expandable Card */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-40 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-slideUp">
          {/* Header */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" />
                Page Management
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Mode Selector */}
            <div className="mb-4">
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                Pagination Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handlePageModeChange('auto')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pageMode === 'auto'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Automatic
                </button>
                <button
                  onClick={() => handlePageModeChange('manual')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    pageMode === 'manual'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Manual
                </button>
              </div>
            </div>

            {/* Auto Mode Settings */}
            {pageMode === 'auto' && (
              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-2 block">
                  Questions per page
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleQuestionsPerPageChange(Math.max(1, questionsPerPage - 1))}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronDown size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={questionsPerPage}
                    onChange={(e) => handleQuestionsPerPageChange(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    onClick={() => handleQuestionsPerPageChange(Math.min(50, questionsPerPage + 1))}
                    className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <ChevronUp size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Manual Mode Info */}
            {pageMode === 'manual' && (
              <div className="mb-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Split size={14} className="text-purple-600 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-purple-900">Manual Page Breaks</p>
                    <p className="text-xs text-purple-700 mt-1">
                      Click the page break icon in the question list to insert breaks
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Page Summary */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-700 mb-2">Page Distribution</div>
              <div className="max-h-48 overflow-y-auto space-y-1">
                {pages.map((page, index) => (
                  <div 
                    key={page.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">Page {page.pageNumber}</span>
                      {page.hasPageBreak && pageMode === 'manual' && (
                        <Split size={10} className="text-purple-600" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>Q{page.startIndex + 1}-{page.endIndex + 1}</span>
                      <span className="text-gray-400">•</span>
                      <span>{page.questions.length} items</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-blue-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-blue-600">{getTotalPages()}</div>
                  <div className="text-xs text-blue-700">Total Pages</div>
                </div>
                <div className="bg-green-50 rounded-lg p-2">
                  <div className="text-lg font-bold text-green-600">{questions.length}</div>
                  <div className="text-xs text-green-700">Questions</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-gray-500 mt-0.5" />
                <p className="text-xs text-gray-600">
                  {pageMode === 'auto' 
                    ? 'Questions are automatically distributed across pages'
                    : 'Use page break buttons to control page divisions'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

export default PageManagerCompact;