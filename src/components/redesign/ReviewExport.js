import React, { useState, useRef } from 'react';
import { 
  Download, FileText, Home, Eye, Settings, Printer,
  FileDown, Check, ChevronLeft, ChevronRight, Layers,
  ZoomIn, ZoomOut, Maximize2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { getOptionLabel, getQuestionPrefix } from '../../utils/languageOptions';

function ReviewExport({ projectData, onBack, onNewProject }) {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [currentPreviewPage, setCurrentPreviewPage] = useState(0);
  const [zoom, setZoom] = useState(0.6);
  const previewRef = useRef(null);

  const paperLanguage = projectData.language || 'english';
  const isProfessional = projectData.mode === 'professional';
  const questions = projectData.questions || [];

  // Organize questions into pages
  const getPages = () => {
    const pages = [];
    const pageMode = projectData.pageSettings?.mode || 'auto';
    const questionsPerPage = projectData.pageSettings?.questionsPerPage || 10;

    if (pageMode === 'auto') {
      // Automatic pagination
      for (let i = 0; i < questions.length; i += questionsPerPage) {
        pages.push({
          questions: questions.slice(i, Math.min(i + questionsPerPage, questions.length)),
          pageNumber: Math.floor(i / questionsPerPage) + 1
        });
      }
    } else {
      // Manual pagination based on page breaks
      let currentPageQuestions = [];
      let pageNumber = 1;

      questions.forEach((question, index) => {
        currentPageQuestions.push({ ...question, globalIndex: index });
        
        if (question.pageBreak || index === questions.length - 1) {
          pages.push({
            questions: [...currentPageQuestions],
            pageNumber: pageNumber
          });
          currentPageQuestions = [];
          pageNumber++;
        }
      });

      if (pages.length === 0 && questions.length > 0) {
        pages.push({
          questions: questions.map((q, i) => ({ ...q, globalIndex: i })),
          pageNumber: 1
        });
      }
    }

    return pages;
  };

  const pages = getPages();
  const totalPages = pages.length || 1;

  const exportToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // PDF settings from template
    const settings = projectData.template?.settings || {};
    
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      const page = pages[pageIndex];
      let yPosition = 25; // Start position

      // Add header on first page
      if (pageIndex === 0) {
        // Paper title
        pdf.setFontSize(18);
        pdf.setFont(undefined, 'bold');
        pdf.text(projectData.name || 'Question Paper', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 10;

        // Paper details (Professional mode)
        if (isProfessional) {
          pdf.setFontSize(12);
          pdf.setFont(undefined, 'normal');
          const details = [];
          if (projectData.subject) details.push(`Subject: ${projectData.subject}`);
          if (projectData.class) details.push(`Class: ${projectData.class}`);
          if (projectData.totalMarks) details.push(`Total Marks: ${projectData.totalMarks}`);
          if (projectData.duration) details.push(`Duration: ${projectData.duration}`);
          
          pdf.text(details.join(' | '), pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 10;
        }

        // Instructions (Professional mode)
        if (isProfessional && projectData.instructions) {
          pdf.setFontSize(11);
          pdf.setFont(undefined, 'bold');
          pdf.text('Instructions:', 20, yPosition);
          yPosition += 6;
          
          pdf.setFont(undefined, 'normal');
          pdf.setFontSize(10);
          const lines = pdf.splitTextToSize(projectData.instructions, pageWidth - 40);
          lines.forEach(line => {
            pdf.text(line, 20, yPosition);
            yPosition += 5;
          });
          yPosition += 5;
        }

        // Add separator line
        pdf.setLineWidth(0.5);
        pdf.line(20, yPosition, pageWidth - 20, yPosition);
        yPosition += 10;
      }

      // Add questions for this page
      page.questions.forEach((q, localIndex) => {
        const questionNumber = q.globalIndex !== undefined ? q.globalIndex + 1 : (pageIndex * 10) + localIndex + 1;
        
        // Check if we need a new page (basic overflow protection)
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          yPosition = 25;
        }

        // Question number and text
        pdf.setFontSize(11);
        pdf.setFont(undefined, 'bold');
        const questionPrefix = `${getQuestionPrefix(paperLanguage)}${questionNumber}.`;
        pdf.text(questionPrefix, 20, yPosition);
        
        pdf.setFont(undefined, 'normal');
        const questionLines = pdf.splitTextToSize(q.question, pageWidth - 50);
        let xPos = 35;
        questionLines.forEach((line, lineIndex) => {
          pdf.text(line, xPos, yPosition + (lineIndex * 5));
        });
        yPosition += questionLines.length * 5 + 3;

        // Options
        pdf.setFontSize(10);
        q.options.forEach((option, optIndex) => {
          if (option) {
            const optionLabel = `(${getOptionLabel(optIndex, paperLanguage)}) ${option}`;
            const optionLines = pdf.splitTextToSize(optionLabel, pageWidth - 55);
            optionLines.forEach((line, lineIndex) => {
              pdf.text(line, 40, yPosition + (lineIndex * 5));
            });
            yPosition += optionLines.length * 5 + 2;
          }
        });

        // Marks (Professional mode)
        if (isProfessional && q.marks) {
          pdf.setFontSize(10);
          pdf.text(`[${q.marks}]`, pageWidth - 25, yPosition - 10);
        }

        yPosition += 8; // Space between questions
      });

      // Page number
      pdf.setFontSize(9);
      pdf.text(`Page ${page.pageNumber} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save the PDF
    const fileName = `${projectData.name || 'question-paper'}-${new Date().getTime()}.pdf`;
    pdf.save(fileName);
  };

  const exportToWord = () => {
    // Implementation for Word export would go here
    // This would typically use a library like docx
    alert('Word export functionality coming soon!');
  };

  const handleExport = () => {
    if (exportFormat === 'pdf') {
      exportToPDF();
    } else if (exportFormat === 'word') {
      exportToWord();
    }
  };

  const renderPagePreview = (pageData, pageIndex) => {
    return (
      <div 
        className="bg-white shadow-lg mx-auto"
        style={{
          width: '210mm',
          minHeight: '297mm',
          padding: '25mm 20mm',
          boxSizing: 'border-box',
          fontFamily: projectData.template?.settings?.fontFamily || 'serif',
          fontSize: projectData.template?.settings?.fontSize || '14px',
          lineHeight: projectData.template?.settings?.lineSpacing || '1.5'
        }}
      >
        {/* Header - Only on first page */}
        {pageIndex === 0 && (
          <>
            <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
              <h1 className="text-3xl font-bold mb-2">
                {projectData.name || 'Question Paper'}
              </h1>
              {isProfessional && (
                <div className="text-base text-gray-700">
                  {projectData.subject && <span className="font-semibold">{projectData.subject}</span>}
                  {projectData.class && <span> • Class: {projectData.class}</span>}
                  {projectData.totalMarks && (
                    <div className="mt-2">
                      Total Marks: {projectData.totalMarks} • Duration: {projectData.duration || 'Not specified'}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Instructions */}
            {isProfessional && projectData.instructions && (
              <div className="mb-6 p-4 border border-gray-300 bg-gray-50">
                <h3 className="font-bold text-lg mb-2">Instructions:</h3>
                <p className="text-base text-gray-700 whitespace-pre-wrap">{projectData.instructions}</p>
              </div>
            )}
          </>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {pageData.questions.map((q, localIndex) => {
            const questionNumber = q.globalIndex !== undefined ? q.globalIndex + 1 : (pageIndex * 10) + localIndex + 1;
            return (
              <div key={localIndex} className="break-inside-avoid">
                <div className="flex items-start gap-3">
                  <span className="font-bold text-lg">
                    {getQuestionPrefix(paperLanguage)}{questionNumber}.
                  </span>
                  <div className="flex-1">
                    <p className="text-base mb-3">{q.question}</p>
                    <div className="ml-4 space-y-2">
                      {q.options.map((option, optIndex) => (
                        <p key={optIndex} className="text-base">
                          ({getOptionLabel(optIndex, paperLanguage)}) {option}
                        </p>
                      ))}
                    </div>
                  </div>
                  {isProfessional && q.marks && (
                    <span className="text-base font-semibold">[{q.marks}]</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Page Number */}
        <div className="absolute bottom-8 left-0 right-0 text-center text-sm text-gray-600">
          Page {pageData.pageNumber} of {totalPages}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Review & Export</h2>
              <p className="text-gray-600">Preview your question paper and export to PDF or Word</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {totalPages} Page{totalPages !== 1 ? 's' : ''}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                {questions.length} Question{questions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Page Navigation */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPreviewPage(Math.max(0, currentPreviewPage - 1))}
                disabled={currentPreviewPage === 0}
                className={`p-2 rounded-lg ${
                  currentPreviewPage === 0 
                    ? 'bg-gray-200 text-gray-400' 
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              
              <span className="text-sm font-medium">
                Page {currentPreviewPage + 1} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPreviewPage(Math.min(totalPages - 1, currentPreviewPage + 1))}
                disabled={currentPreviewPage === totalPages - 1}
                className={`p-2 rounded-lg ${
                  currentPreviewPage === totalPages - 1 
                    ? 'bg-gray-200 text-gray-400' 
                    : 'bg-white hover:bg-gray-100 text-gray-700'
                }`}
              >
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm font-medium px-3">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom(Math.min(1, zoom + 0.1))}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg"
              >
                <ZoomIn size={18} />
              </button>
            </div>

            {/* Export Format */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Export as:</span>
              <select
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="pdf">PDF</option>
                <option value="word">Word Document</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preview Area */}
        <div className="p-6 bg-gray-100" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div 
            ref={previewRef}
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              marginBottom: `${-40 * (1 - zoom)}%`
            }}
          >
            {pages[currentPreviewPage] && renderPagePreview(pages[currentPreviewPage], currentPreviewPage)}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between">
          <button 
            onClick={onBack} 
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Back to Editor
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={onNewProject} 
              className="px-6 py-2 bg-gray-600 text-white hover:bg-gray-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Home size={18} />
              New Project
            </button>
            
            <button 
              onClick={handleExport}
              className="px-6 py-2 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewExport;