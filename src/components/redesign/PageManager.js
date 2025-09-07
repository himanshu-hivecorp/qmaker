import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Trash2, Copy, ChevronLeft, ChevronRight,
  Settings, Eye, EyeOff, Layers, Layout, Split,
  AlertCircle, Info, Check, X
} from 'lucide-react';

function PageManager({ questions, onUpdateQuestions, projectData, onUpdateProject }) {
  const [pageMode, setPageMode] = useState('auto'); // 'auto' or 'manual'
  const [questionsPerPage, setQuestionsPerPage] = useState(10);
  const [pages, setPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [showPageSettings, setShowPageSettings] = useState(false);

  // Calculate pages based on mode
  useEffect(() => {
    if (pageMode === 'auto') {
      // Automatic pagination based on questions per page
      const newPages = [];
      for (let i = 0; i < questions.length; i += questionsPerPage) {
        newPages.push({
          id: `page-${i / questionsPerPage + 1}`,
          questions: questions.slice(i, i + questionsPerPage),
          pageNumber: i / questionsPerPage + 1,
          hasPageBreak: true
        });
      }
      setPages(newPages);
    } else {
      // Manual pagination - questions have pageBreak property
      const newPages = [];
      let currentPageQuestions = [];
      let pageNumber = 1;

      questions.forEach((question, index) => {
        currentPageQuestions.push(question);
        
        // Check if this question has a page break or is the last question
        if (question.pageBreak || index === questions.length - 1) {
          newPages.push({
            id: `page-${pageNumber}`,
            questions: [...currentPageQuestions],
            pageNumber: pageNumber,
            hasPageBreak: true
          });
          currentPageQuestions = [];
          pageNumber++;
        }
      });

      if (newPages.length === 0 && questions.length > 0) {
        // If no page breaks, put all questions on one page
        newPages.push({
          id: 'page-1',
          questions: [...questions],
          pageNumber: 1,
          hasPageBreak: true
        });
      }

      setPages(newPages);
    }
  }, [questions, pageMode, questionsPerPage]);

  const handlePageModeChange = (mode) => {
    setPageMode(mode);
    
    // Update project data
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

  const togglePageBreak = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      pageBreak: !updatedQuestions[questionIndex].pageBreak
    };
    onUpdateQuestions(updatedQuestions);
  };

  const insertPageBreak = (afterQuestionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[afterQuestionIndex] = {
      ...updatedQuestions[afterQuestionIndex],
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

  const getTotalPages = () => pages.length;

  const getPageInfo = (pageIndex) => {
    if (!pages[pageIndex]) return null;
    const page = pages[pageIndex];
    return {
      pageNumber: page.pageNumber,
      questionCount: page.questions.length,
      startQuestion: pages.slice(0, pageIndex).reduce((sum, p) => sum + p.questions.length, 0) + 1,
      endQuestion: pages.slice(0, pageIndex + 1).reduce((sum, p) => sum + p.questions.length, 0)
    };
  };

  return (
    <div className="page-manager">
      {/* Page Settings Bar */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-gray-600" />
              <span className="font-medium text-gray-900">Page Management</span>
            </div>
            
            {/* Mode Selector */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handlePageModeChange('auto')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  pageMode === 'auto'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Automatic
              </button>
              <button
                onClick={() => handlePageModeChange('manual')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  pageMode === 'manual'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Manual
              </button>
            </div>

            {/* Automatic Mode Settings */}
            {pageMode === 'auto' && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Questions per page:</span>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={questionsPerPage}
                  onChange={(e) => handleQuestionsPerPageChange(e.target.value)}
                  className="w-16 px-2 py-1 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-600">
              <span className="font-medium">{getTotalPages()}</span> page{getTotalPages() !== 1 ? 's' : ''}
              {' • '}
              <span className="font-medium">{questions.length}</span> question{questions.length !== 1 ? 's' : ''}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowPageSettings(!showPageSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Page Settings"
            >
              <Settings size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Mode Info */}
        <div className={`mt-3 p-3 rounded-lg flex items-start gap-2 ${
          pageMode === 'auto' ? 'bg-blue-50 border border-blue-200' : 'bg-purple-50 border border-purple-200'
        }`}>
          <Info size={16} className={pageMode === 'auto' ? 'text-blue-600 mt-0.5' : 'text-purple-600 mt-0.5'} />
          <div className="text-sm">
            {pageMode === 'auto' ? (
              <>
                <span className="font-medium text-blue-900">Automatic Mode:</span>
                <span className="text-blue-700"> Questions are automatically distributed across pages based on your setting.</span>
              </>
            ) : (
              <>
                <span className="font-medium text-purple-900">Manual Mode:</span>
                <span className="text-purple-700"> You control page breaks. Click the page break button after any question.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      {getTotalPages() > 1 && (
        <div className="bg-white rounded-lg border border-gray-200 p-3 mb-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === 0 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-2">
              {pages.map((page, index) => {
                const info = getPageInfo(index);
                return (
                  <button
                    key={page.id}
                    onClick={() => setCurrentPage(index)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === index
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    title={`Questions ${info.startQuestion}-${info.endQuestion}`}
                  >
                    Page {page.pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(getTotalPages() - 1, currentPage + 1))}
              disabled={currentPage === getTotalPages() - 1}
              className={`p-2 rounded-lg transition-colors ${
                currentPage === getTotalPages() - 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Page Settings Modal */}
      {showPageSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Page Settings</h3>
              <button
                onClick={() => setShowPageSettings(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Size
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="a4"
                >
                  <option value="a4">A4 (210mm × 297mm)</option>
                  <option value="letter">Letter (8.5" × 11")</option>
                  <option value="legal">Legal (8.5" × 14")</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Orientation
                </label>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border-2 border-indigo-500 bg-indigo-50 text-indigo-700 rounded-lg font-medium">
                    Portrait
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50">
                    Landscape
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Margins
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Top" className="px-3 py-2 border border-gray-200 rounded-lg" defaultValue="25" />
                  <input type="number" placeholder="Bottom" className="px-3 py-2 border border-gray-200 rounded-lg" defaultValue="25" />
                  <input type="number" placeholder="Left" className="px-3 py-2 border border-gray-200 rounded-lg" defaultValue="20" />
                  <input type="number" placeholder="Right" className="px-3 py-2 border border-gray-200 rounded-lg" defaultValue="20" />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="pageNumbers" className="rounded" defaultChecked />
                <label htmlFor="pageNumbers" className="text-sm text-gray-700">Show page numbers</label>
              </div>

              <div className="flex items-center gap-3">
                <input type="checkbox" id="headerFooter" className="rounded" defaultChecked />
                <label htmlFor="headerFooter" className="text-sm text-gray-700">Include header and footer</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPageSettings(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowPageSettings(false)}
                className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors"
              >
                Apply Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PageManager;