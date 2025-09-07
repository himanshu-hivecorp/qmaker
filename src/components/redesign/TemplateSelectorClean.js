import React, { useState } from 'react';
import { 
  Layout, FileText, Grid, GraduationCap, ChevronRight, Check, 
  Star, Clock, Award, BookOpen, Eye, Settings, ArrowRight
} from 'lucide-react';
import { getOptionLabel, getQuestionPrefix } from '../../utils/languageOptions';

function TemplateSelectorClean({ onSelectTemplate, onBack, projectData }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const paperLanguage = projectData.language || 'english';
  const isProfessional = projectData.mode === 'professional';

  const templates = [
    {
      id: 'classic',
      name: 'Classic Format',
      description: 'Traditional question paper layout with clear sections',
      icon: <FileText size={28} />,
      color: '#3B82F6',
      bgGradient: 'from-blue-50 to-blue-100',
      features: ['Standard numbering', 'Clear sections', 'Print optimized'],
      settings: {
        fontFamily: 'Times New Roman, serif',
        fontSize: '14px',
        questionSize: '14',
        optionSize: '13',
        lineSpacing: '1.5',
        questionSpacing: '20',
        marginSize: '30',
        primaryColor: '#1e40af',
        accentColor: '#3b82f6',
        headerStyle: 'traditional',
        optionLayout: 'vertical',
        numberingStyle: 'Q1, Q2, Q3...'
      }
    },
    {
      id: 'modern',
      name: 'Modern Clean',
      description: 'Clean, minimalist design with excellent readability',
      icon: <Layout size={28} />,
      color: '#10B981',
      bgGradient: 'from-green-50 to-emerald-100',
      features: ['Clean typography', 'Modern spacing', 'Digital friendly'],
      settings: {
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        fontSize: '16px',
        questionSize: '16',
        optionSize: '14',
        lineSpacing: '1.6',
        questionSpacing: '28',
        marginSize: '40',
        primaryColor: '#059669',
        accentColor: '#10b981',
        headerStyle: 'modern',
        optionLayout: 'vertical',
        numberingStyle: '1. 2. 3...'
      }
    },
    {
      id: 'compact',
      name: 'Space Saver',
      description: 'Optimized for fitting more questions per page',
      icon: <Grid size={28} />,
      color: '#F59E0B',
      bgGradient: 'from-amber-50 to-orange-100',
      features: ['Maximum content', 'Compact layout', 'Paper saving'],
      settings: {
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize: '13px',
        questionSize: '13',
        optionSize: '12',
        lineSpacing: '1.3',
        questionSpacing: '16',
        marginSize: '25',
        primaryColor: '#d97706',
        accentColor: '#f59e0b',
        headerStyle: 'compact',
        optionLayout: 'inline',
        numberingStyle: '1) 2) 3)...'
      }
    },
    {
      id: 'academic',
      name: 'Academic Pro',
      description: 'Professional academic examination format',
      icon: <GraduationCap size={28} />,
      color: '#8B5CF6',
      bgGradient: 'from-purple-50 to-violet-100',
      features: ['Academic standard', 'Formal structure', 'Professional look'],
      settings: {
        fontFamily: 'Georgia, Cambria, serif',
        fontSize: '15px',
        questionSize: '15',
        optionSize: '14',
        lineSpacing: '1.8',
        questionSpacing: '32',
        marginSize: '35',
        primaryColor: '#6d28d9',
        accentColor: '#8b5cf6',
        headerStyle: 'academic',
        optionLayout: 'vertical',
        numberingStyle: 'Question 1, Question 2...'
      }
    }
  ];

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        onSelectTemplate(template);
      } else {
        console.error('Template not found:', selectedTemplate);
      }
    }
  };

  const handlePreview = (templateId) => {
    setPreviewTemplate(templateId);
  };

  const getTemplatePreview = (template) => {
    if (!template || !template.settings) {
      return (
        <div className="h-full flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Template not available</p>
        </div>
      );
    }
    
    const questionNum = template.numberingStyle?.split(' ')[0]?.replace('...', '') || '1';
    const questionPrefix = getQuestionPrefix(paperLanguage);
    
    return (
      <div 
        className="h-full p-6 bg-white"
        style={{
          fontFamily: template.settings.fontFamily,
          fontSize: template.settings.fontSize,
          lineHeight: template.settings.lineSpacing,
          color: '#1f2937'
        }}
      >
        {/* Header Preview */}
        <div 
          className="text-center mb-4 pb-3"
          style={{
            borderBottom: `2px solid ${template.settings.primaryColor}`,
          }}
        >
          <h3 
            className="font-bold mb-1"
            style={{ 
              fontSize: `${parseInt(template.settings.questionSize) + 4}px`,
              color: template.settings.primaryColor
            }}
          >
            {projectData.name || 'Sample Question Paper'}
          </h3>
          {isProfessional && (
            <p style={{ fontSize: `${template.settings.optionSize}px` }}>
              {projectData.subject || 'Subject'} • {projectData.class || 'Class'}
            </p>
          )}
        </div>

        {/* Sample Question */}
        <div style={{ marginBottom: `${template.settings.questionSpacing}px` }}>
          <div className="flex items-start gap-3">
            <span 
              className="font-semibold"
              style={{ 
                fontSize: `${template.settings.questionSize}px`,
                color: template.settings.primaryColor
              }}
            >
              {template.id === 'academic' ? 'Question 1.' : 
               template.id === 'classic' ? `${questionPrefix}1.` :
               template.id === 'compact' ? '1)' : '1.'}
            </span>
            <div className="flex-1">
              <p style={{ fontSize: `${template.settings.questionSize}px`, marginBottom: '8px' }}>
                What is the capital of India?
              </p>
              
              {/* Options based on layout */}
              {template.settings.optionLayout === 'inline' ? (
                <div className="flex flex-wrap gap-4" style={{ fontSize: `${template.settings.optionSize}px` }}>
                  {['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'].map((option, idx) => (
                    <span key={idx}>
                      ({getOptionLabel(idx, paperLanguage)}) {option}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 ml-4" style={{ fontSize: `${template.settings.optionSize}px` }}>
                  {['New Delhi', 'Mumbai', 'Kolkata', 'Chennai'].map((option, idx) => (
                    <div key={idx}>
                      ({getOptionLabel(idx, paperLanguage)}) {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isProfessional && (
              <span style={{ fontSize: `${template.settings.optionSize}px`, color: '#6b7280' }}>
                [{projectData.defaultMarks || '1'}]
              </span>
            )}
          </div>
        </div>

        {/* Second Sample Question */}
        <div>
          <div className="flex items-start gap-3">
            <span 
              className="font-semibold"
              style={{ 
                fontSize: `${template.settings.questionSize}px`,
                color: template.settings.primaryColor
              }}
            >
              {template.id === 'academic' ? 'Question 2.' : 
               template.id === 'classic' ? `${questionPrefix}2.` :
               template.id === 'compact' ? '2)' : '2.'}
            </span>
            <div className="flex-1">
              <p style={{ fontSize: `${template.settings.questionSize}px`, marginBottom: '8px' }}>
                Which of the following is a prime number?
              </p>
              
              {template.settings.optionLayout === 'inline' ? (
                <div className="flex flex-wrap gap-4" style={{ fontSize: `${template.settings.optionSize}px` }}>
                  {['4', '6', '7', '9'].map((option, idx) => (
                    <span key={idx}>
                      ({getOptionLabel(idx, paperLanguage)}) {option}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 ml-4" style={{ fontSize: `${template.settings.optionSize}px` }}>
                  {['4', '6', '7', '9'].map((option, idx) => (
                    <div key={idx}>
                      ({getOptionLabel(idx, paperLanguage)}) {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {isProfessional && (
              <span style={{ fontSize: `${template.settings.optionSize}px`, color: '#6b7280' }}>
                [{projectData.defaultMarks || '1'}]
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
          <p className="text-gray-600">
            Select a layout that best suits your question paper style
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Template List */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Available Templates</h3>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedTemplate(template.id)}
                  >
                    <div className="flex items-start gap-4">
                      <div 
                        className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.bgGradient} flex items-center justify-center`}
                        style={{ color: template.color }}
                      >
                        {template.icon}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{template.name}</h4>
                          {selectedTemplate === template.id && (
                            <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                              <Check size={14} className="text-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        
                        <div className="flex flex-wrap gap-2">
                          {template.features.map((feature, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded-md"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handlePreview(template.id);
                          }}
                          className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                        >
                          <Eye size={14} />
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Preview */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Live Preview</h3>
              <div className="border-2 border-gray-200 rounded-xl overflow-hidden" style={{ height: '500px' }}>
                {(previewTemplate || selectedTemplate) ? (
                  getTemplatePreview(
                    templates.find(t => t.id === (previewTemplate || selectedTemplate))
                  )
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <Eye size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">Select a template to preview</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Preview will show in {paperLanguage === 'hindi' ? 'Hindi' : paperLanguage === 'odia' ? 'Odia' : 'English'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Template Settings Info */}
          {selectedTemplate && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Settings size={20} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Template Settings</p>
                  <p className="text-xs text-blue-700 mt-1">
                    This template will apply: {templates.find(t => t.id === selectedTemplate)?.settings.fontFamily}, 
                    {' '}{templates.find(t => t.id === selectedTemplate)?.settings.fontSize} font size, 
                    {' '}{templates.find(t => t.id === selectedTemplate)?.settings.lineSpacing} line spacing
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
            className={`px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
              selectedTemplate
                ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Apply Template
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelectorClean;