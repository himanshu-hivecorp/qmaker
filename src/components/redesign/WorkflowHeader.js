import React from 'react';
import { FileText, Layout, Edit3, Download, Check, ChevronRight } from 'lucide-react';

function WorkflowHeader({ currentStep, completedSteps, projectName, onStepClick }) {
  const steps = [
    { id: 'welcome', label: 'Project Setup', icon: <FileText size={20} /> },
    { id: 'template', label: 'Choose Template', icon: <Layout size={20} /> },
    { id: 'editor', label: 'Add Questions', icon: <Edit3 size={20} /> },
    { id: 'export', label: 'Review & Export', icon: <Download size={20} /> }
  ];

  const getStepStatus = (stepId) => {
    if (currentStep === stepId) return 'current';
    if (completedSteps.includes(stepId)) return 'completed';
    return 'pending';
  };

  const canNavigateToStep = (stepId) => {
    return completedSteps.includes(stepId) || 
           (stepId === 'editor' && completedSteps.includes('template'));
  };

  return (
    <header className="workflow-header glass-dark" style={{
      padding: '1rem 2rem',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white bg-opacity-10">
              <FileText size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-white font-semibold text-lg">{projectName || 'Question Paper Generator'}</h1>
              <p className="text-white text-opacity-70 text-sm">Professional Edition</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-white text-opacity-70 text-sm">Auto-saved</span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          </div>
        </div>
        
        <nav className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white bg-opacity-10 -translate-y-1/2 z-0"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary to-secondary -translate-y-1/2 z-0 transition-all duration-500"
            style={{
              width: `${(steps.findIndex(s => s.id === currentStep) / (steps.length - 1)) * 100}%`
            }}
          ></div>
          
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const canNavigate = canNavigateToStep(step.id);
            
            return (
              <div key={step.id} className="relative z-10 flex items-center">
                <button
                  onClick={() => canNavigate && onStepClick(step.id)}
                  disabled={!canNavigate}
                  className={`
                    flex flex-col items-center gap-2 p-2 rounded-lg transition-all
                    ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}
                    ${status === 'current' ? 'scale-110' : ''}
                  `}
                >
                  <div className={`
                    p-3 rounded-full transition-all
                    ${status === 'completed' ? 'bg-secondary text-white' : ''}
                    ${status === 'current' ? 'bg-primary text-white ring-4 ring-primary ring-opacity-30' : ''}
                    ${status === 'pending' ? 'bg-white bg-opacity-20 text-white text-opacity-50' : ''}
                  `}>
                    {status === 'completed' ? <Check size={20} /> : step.icon}
                  </div>
                  <span className={`
                    text-xs font-medium whitespace-nowrap
                    ${status === 'pending' ? 'text-white text-opacity-50' : 'text-white'}
                  `}>
                    {step.label}
                  </span>
                </button>
                
                {index < steps.length - 1 && (
                  <ChevronRight 
                    size={16} 
                    className="text-white text-opacity-30 mx-2"
                  />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default WorkflowHeader;