import React from 'react';
import { FileText, Layout, Edit3, Download, Check, Circle } from 'lucide-react';

function WorkflowHeaderClean({ currentStep, completedSteps, projectName, onStepClick }) {
  const steps = [
    { id: 'welcome', label: 'Setup', icon: <FileText size={18} /> },
    { id: 'template', label: 'Template', icon: <Layout size={18} /> },
    { id: 'editor', label: 'Questions', icon: <Edit3 size={18} /> },
    { id: 'export', label: 'Export', icon: <Download size={18} /> }
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

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-gray-800">
              {projectName || 'Question Paper Generator'}
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Auto-saved</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
        
        <nav className="flex items-center justify-center gap-8">
          {steps.map((step, index) => {
            const status = getStepStatus(step.id);
            const canNavigate = canNavigateToStep(step.id);
            
            return (
              <button
                key={step.id}
                onClick={() => canNavigate && onStepClick(step.id)}
                disabled={!canNavigate}
                className={`
                  flex items-center gap-3 py-2 px-4 rounded-lg transition-all
                  ${canNavigate ? 'cursor-pointer' : 'cursor-not-allowed'}
                  ${status === 'current' ? 'bg-indigo-50 text-indigo-600' : ''}
                  ${status === 'completed' ? 'text-green-600 hover:bg-gray-50' : ''}
                  ${status === 'pending' ? 'text-gray-400' : ''}
                `}
              >
                <div className={`
                  flex items-center justify-center w-8 h-8 rounded-full transition-all
                  ${status === 'completed' ? 'bg-green-100' : ''}
                  ${status === 'current' ? 'bg-indigo-100' : ''}
                  ${status === 'pending' ? 'bg-gray-100' : ''}
                `}>
                  {status === 'completed' ? <Check size={16} className="text-green-600" /> : step.icon}
                </div>
                <div className="text-left">
                  <div className={`text-sm font-medium ${status === 'current' ? 'text-indigo-600' : ''}`}>
                    {step.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {status === 'completed' && 'Complete'}
                    {status === 'current' && 'In Progress'}
                    {status === 'pending' && 'Pending'}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden sm:block ml-4">
                    <div className={`w-12 h-0.5 ${index < currentStepIndex ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

export default WorkflowHeaderClean;