import React, { useState } from 'react';
import { Layout, FileText, Grid, List, ChevronRight, Check, Eye } from 'lucide-react';

function TemplateSelector({ onSelectTemplate, onBack, projectData }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const templates = [
    {
      id: 'classic',
      name: 'Classic Format',
      description: 'Traditional question paper layout with clear sections',
      icon: <FileText size={32} />,
      preview: {
        questionFormat: 'Q1. Question text here',
        optionFormat: '(a) Option 1  (b) Option 2  (c) Option 3  (d) Option 4',
        layout: 'vertical'
      },
      settings: {
        fontFamily: 'Times New Roman, serif',
        questionSize: '14',
        optionSize: '13',
        lineSpacing: '1.5',
        questionSpacing: '20',
        marginSize: '30'
      },
      color: '#4F46E5'
    },
    {
      id: 'modern',
      name: 'Modern Clean',
      description: 'Clean, minimalist design with excellent readability',
      icon: <Layout size={32} />,
      preview: {
        questionFormat: '1. Question text here',
        optionFormat: 'A. Option 1\nB. Option 2\nC. Option 3\nD. Option 4',
        layout: 'vertical'
      },
      settings: {
        fontFamily: 'Inter, sans-serif',
        questionSize: '16',
        optionSize: '14',
        lineSpacing: '1.6',
        questionSpacing: '28',
        marginSize: '40'
      },
      color: '#10B981'
    },
    {
      id: 'compact',
      name: 'Space Saver',
      description: 'Optimized for fitting more questions per page',
      icon: <Grid size={32} />,
      preview: {
        questionFormat: 'Q1) Question text',
        optionFormat: '(a) Opt1  (b) Opt2  (c) Opt3  (d) Opt4',
        layout: 'horizontal'
      },
      settings: {
        fontFamily: 'Arial, sans-serif',
        questionSize: '13',
        optionSize: '12',
        lineSpacing: '1.3',
        questionSpacing: '16',
        marginSize: '25'
      },
      color: '#F59E0B'
    },
    {
      id: 'academic',
      name: 'Academic Standard',
      description: 'Professional academic examination format',
      icon: <List size={32} />,
      preview: {
        questionFormat: 'Question 1. Question text here',
        optionFormat: '(i) Option 1\n(ii) Option 2\n(iii) Option 3\n(iv) Option 4',
        layout: 'vertical'
      },
      settings: {
        fontFamily: 'Georgia, serif',
        questionSize: '15',
        optionSize: '14',
        lineSpacing: '1.8',
        questionSpacing: '32',
        marginSize: '35'
      },
      color: '#8B5CF6'
    }
  ];

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  const TemplatePreview = ({ template }) => (
    <div 
      className="bg-white p-6 rounded-lg border-2 border-gray-200"
      style={{ fontFamily: template.settings.fontFamily }}
    >
      <h4 className="font-bold mb-4 text-center" style={{ fontSize: '18px' }}>
        Sample Preview
      </h4>
      
      <div className="space-y-4">
        <div>
          <p style={{ fontSize: `${template.settings.questionSize}px`, marginBottom: '8px' }}>
            {template.preview.questionFormat}
          </p>
          <div style={{ 
            fontSize: `${template.settings.optionSize}px`,
            marginLeft: '20px',
            lineHeight: template.settings.lineSpacing
          }}>
            {template.preview.layout === 'horizontal' ? (
              <p>{template.preview.optionFormat}</p>
            ) : (
              template.preview.optionFormat.split('\n').map((opt, i) => (
                <p key={i}>{opt}</p>
              ))
            )}
          </div>
        </div>
        
        <div>
          <p style={{ fontSize: `${template.settings.questionSize}px`, marginBottom: '8px' }}>
            Q2. Another sample question to show spacing?
          </p>
          <div style={{ 
            fontSize: `${template.settings.optionSize}px`,
            marginLeft: '20px',
            lineHeight: template.settings.lineSpacing
          }}>
            {template.preview.layout === 'horizontal' ? (
              <p>(a) Yes  (b) No  (c) Maybe  (d) Not sure</p>
            ) : (
              <>
                <p>{template.preview.layout === 'vertical' ? 'A' : '(i)'} Yes</p>
                <p>{template.preview.layout === 'vertical' ? 'B' : '(ii)'} No</p>
                <p>{template.preview.layout === 'vertical' ? 'C' : '(iii)'} Maybe</p>
                <p>{template.preview.layout === 'vertical' ? 'D' : '(iv)'} Not sure</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="template-selector-container" style={{ maxWidth: '1200px', width: '100%' }}>
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold mb-2">Choose Your Template</h2>
        <p className="text-muted">Select a layout that best suits your question paper style</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-4">Available Templates</h3>
          <div className="space-y-3">
            {templates.map((template) => (
              <div
                key={template.id}
                onClick={() => {
                  setSelectedTemplate(template);
                  setPreviewTemplate(template);
                }}
                className={`card cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-primary shadow-lg transform scale-105' 
                    : 'hover:shadow-md'
                }`}
              >
                <div className="card-body flex items-center gap-4">
                  <div 
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    <div style={{ color: template.color }}>
                      {template.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      {template.name}
                      {selectedTemplate?.id === template.id && (
                        <Check size={20} className="text-primary" />
                      )}
                    </h4>
                    <p className="text-sm text-muted">{template.description}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPreviewTemplate(template);
                    }}
                    className="btn btn-ghost btn-sm"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Eye size={20} />
            Live Preview
          </h3>
          <div className="sticky top-4">
            {previewTemplate ? (
              <TemplatePreview template={previewTemplate} />
            ) : (
              <div className="bg-gray-50 rounded-lg p-12 text-center">
                <Eye size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-muted">Select a template to preview</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card glass mt-6 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="badge badge-primary">
              Step 2 of 4
            </div>
            <div>
              <h4 className="font-semibold">{projectData.name}</h4>
              <p className="text-sm text-muted">
                {projectData.subject} • {projectData.class}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="btn btn-outline"
            >
              Back
            </button>
            <button
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate}
              className="btn btn-primary btn-lg"
            >
              Continue with {selectedTemplate?.name || 'Template'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;