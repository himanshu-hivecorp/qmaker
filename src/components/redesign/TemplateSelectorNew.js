import React, { useState } from 'react';
import { 
  Layout, FileText, Grid, List, ChevronRight, Check, Eye, 
  Sparkles, Zap, BookOpen, GraduationCap, Star, TrendingUp,
  Clock, FileCheck, Globe, Palette
} from 'lucide-react';

function TemplateSelectorNew({ onSelectTemplate, onBack, projectData }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const templates = [
    {
      id: 'classic',
      name: 'Classic Format',
      description: 'Traditional question paper layout with clear sections',
      icon: <FileText size={40} />,
      badge: 'Most Popular',
      badgeColor: 'bg-blue-500',
      features: ['Standard numbering', 'Clear sections', 'Traditional layout', 'Print optimized'],
      preview: {
        header: 'EXAMINATION - 2025',
        subheader: 'Subject: Mathematics | Class: X | Time: 3 Hours | Max Marks: 100',
        instructions: [
          'All questions are compulsory',
          'Write clearly and legibly',
          'Show all working'
        ],
        sampleQuestion: {
          number: 'Q1.',
          text: 'Solve the following quadratic equation: x² + 5x + 6 = 0',
          marks: '[5 Marks]',
          options: ['(a) x = -2, -3', '(b) x = 2, 3', '(c) x = -2, 3', '(d) x = 2, -3']
        }
      },
      settings: {
        fontFamily: 'Times New Roman, serif',
        questionSize: '14',
        optionSize: '13',
        lineSpacing: '1.5',
        questionSpacing: '20',
        marginSize: '30',
        primaryColor: '#1e40af',
        layout: 'vertical'
      },
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      id: 'modern',
      name: 'Modern Clean',
      description: 'Clean, minimalist design with excellent readability',
      icon: <Layout size={40} />,
      badge: 'Recommended',
      badgeColor: 'bg-green-500',
      features: ['Clean typography', 'Modern spacing', 'Easy to read', 'Digital friendly'],
      preview: {
        header: 'Assessment Paper',
        subheader: 'Mathematics • Grade 10 • Duration: 3 Hours',
        instructions: [
          '• Answer all questions',
          '• Use blue or black pen',
          '• Calculators allowed'
        ],
        sampleQuestion: {
          number: '1.',
          text: 'Solve the following quadratic equation: x² + 5x + 6 = 0',
          marks: '5 points',
          options: ['A. x = -2, -3', 'B. x = 2, 3', 'C. x = -2, 3', 'D. x = 2, -3']
        }
      },
      settings: {
        fontFamily: 'Inter, sans-serif',
        questionSize: '16',
        optionSize: '14',
        lineSpacing: '1.6',
        questionSpacing: '28',
        marginSize: '40',
        primaryColor: '#059669',
        layout: 'vertical'
      },
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      id: 'compact',
      name: 'Space Saver',
      description: 'Optimized for fitting more questions per page',
      icon: <Grid size={40} />,
      badge: 'Efficient',
      badgeColor: 'bg-orange-500',
      features: ['Maximum content', 'Compact layout', 'Grid options', 'Paper saving'],
      preview: {
        header: 'Test Paper - Mathematics',
        subheader: 'Class X | 3 Hrs | 100 Marks',
        instructions: [
          '1. All questions compulsory',
          '2. Write answers in sequence',
        ],
        sampleQuestion: {
          number: 'Q1)',
          text: 'Solve: x² + 5x + 6 = 0',
          marks: '[5]',
          options: ['(a) -2,-3  (b) 2,3  (c) -2,3  (d) 2,-3']
        }
      },
      settings: {
        fontFamily: 'Arial, sans-serif',
        questionSize: '13',
        optionSize: '12',
        lineSpacing: '1.3',
        questionSpacing: '16',
        marginSize: '25',
        primaryColor: '#ea580c',
        layout: 'horizontal'
      },
      gradient: 'from-orange-400 to-amber-600'
    },
    {
      id: 'academic',
      name: 'Academic Pro',
      description: 'Professional academic examination format',
      icon: <GraduationCap size={40} />,
      badge: 'Premium',
      badgeColor: 'bg-purple-500',
      features: ['Academic standard', 'Formal structure', 'Section dividers', 'Professional look'],
      preview: {
        header: 'ACADEMIC EXAMINATION',
        subheader: 'Department of Mathematics | Course: Advanced Algebra | Time: 3 Hours',
        instructions: [
          'Instructions to Candidates:',
          '(i) This paper contains 4 sections',
          '(ii) All sections are mandatory',
        ],
        sampleQuestion: {
          number: 'Question 1.',
          text: 'Solve the following quadratic equation and show all steps: x² + 5x + 6 = 0',
          marks: '(5 Marks)',
          options: ['(i) x = -2, -3', '(ii) x = 2, 3', '(iii) x = -2, 3', '(iv) x = 2, -3']
        }
      },
      settings: {
        fontFamily: 'Georgia, serif',
        questionSize: '15',
        optionSize: '14',
        lineSpacing: '1.8',
        questionSpacing: '32',
        marginSize: '35',
        primaryColor: '#7c3aed',
        layout: 'vertical'
      },
      gradient: 'from-purple-400 to-indigo-600'
    }
  ];

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };

  return (
    <div className="template-selector-container" style={{ maxWidth: '1400px', width: '100%' }}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-4">
          <Palette size={32} className="text-white" />
        </div>
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Choose Your Perfect Template
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select a professionally designed layout that matches your examination style and requirements
        </p>
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {templates.map((template) => (
          <div
            key={template.id}
            className={`relative group cursor-pointer transition-all duration-300 ${
              selectedTemplate?.id === template.id 
                ? 'transform scale-[1.02]' 
                : 'hover:transform hover:scale-[1.01]'
            }`}
            onMouseEnter={() => setHoveredTemplate(template.id)}
            onMouseLeave={() => setHoveredTemplate(null)}
            onClick={() => setSelectedTemplate(template)}
          >
            {/* Card Container */}
            <div className={`
              relative overflow-hidden rounded-2xl bg-white 
              ${selectedTemplate?.id === template.id 
                ? 'ring-4 ring-offset-2 ring-indigo-500 shadow-2xl' 
                : 'shadow-lg hover:shadow-2xl'
              }
            `}>
              {/* Gradient Header */}
              <div className={`
                h-32 bg-gradient-to-br ${template.gradient} 
                flex items-center justify-center relative overflow-hidden
              `}>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full -ml-16 -mb-16"></div>
                
                <div className="relative z-10 text-white">
                  {template.icon}
                </div>
                
                {/* Badge */}
                <div className={`absolute top-4 right-4 ${template.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                  {template.badge}
                </div>
                
                {/* Selection indicator */}
                {selectedTemplate?.id === template.id && (
                  <div className="absolute top-4 left-4 bg-white rounded-full p-2">
                    <Check size={20} className="text-green-500" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{template.name}</h3>
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                {/* Features */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {template.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                      <Star size={14} className="text-yellow-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Preview Panel */}
                <div 
                  className="border-t pt-4 mt-4"
                  style={{ fontFamily: template.settings.fontFamily }}
                >
                  <div className="bg-gray-50 rounded-lg p-4 text-sm">
                    {/* Preview Header */}
                    <div className="text-center mb-3 pb-2 border-b border-gray-200">
                      <h4 className="font-bold" style={{ fontSize: '16px' }}>
                        {template.preview.header}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {template.preview.subheader}
                      </p>
                    </div>
                    
                    {/* Instructions */}
                    <div className="mb-3 text-xs text-gray-600">
                      {template.preview.instructions.map((inst, idx) => (
                        <p key={idx}>{inst}</p>
                      ))}
                    </div>
                    
                    {/* Sample Question */}
                    <div className="bg-white rounded p-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold" style={{ fontSize: `${template.settings.questionSize}px` }}>
                          {template.preview.sampleQuestion.number} {template.preview.sampleQuestion.text}
                        </p>
                        <span className="text-xs text-gray-500">
                          {template.preview.sampleQuestion.marks}
                        </span>
                      </div>
                      <div style={{ fontSize: `${template.settings.optionSize}px` }}>
                        {template.settings.layout === 'horizontal' ? (
                          <p className="text-gray-700">{template.preview.sampleQuestion.options.join('  ')}</p>
                        ) : (
                          template.preview.sampleQuestion.options.map((opt, idx) => (
                            <p key={idx} className="text-gray-700 ml-4">{opt}</p>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  className={`
                    w-full mt-4 py-3 rounded-lg font-semibold transition-all
                    ${selectedTemplate?.id === template.id 
                      ? 'bg-gradient-to-r ' + template.gradient + ' text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  `}
                >
                  {selectedTemplate?.id === template.id ? 'Selected' : 'Select This Template'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="card glass p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="badge badge-primary">
              Step 2 of 4
            </div>
            <div>
              <h4 className="font-semibold">{projectData.name}</h4>
              <p className="text-sm text-muted">
                {projectData.subject} • {projectData.class}
                {projectData.totalMarks && ` • ${projectData.totalMarks} Marks`}
                {projectData.duration && ` • ${projectData.duration}`}
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
              className="btn btn-primary btn-lg flex items-center gap-2"
            >
              <span>Continue with {selectedTemplate?.name || 'Template'}</span>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelectorNew;