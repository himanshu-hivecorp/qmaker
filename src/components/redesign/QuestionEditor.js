import React from 'react';
import { Plus, Save, ChevronRight } from 'lucide-react';

function QuestionEditor({ projectData, onUpdateQuestions, onUpdateProject, onNext, onBack }) {
  return (
    <div className="editor-container" style={{ maxWidth: '1200px', width: '100%' }}>
      <div className="card glass">
        <div className="card-header">
          <h2 className="text-2xl font-bold">Question Editor</h2>
          <p className="text-muted">Add and manage your questions</p>
        </div>
        
        <div className="card-body">
          <p className="text-center text-muted p-12">
            Question editor interface coming soon...
          </p>
        </div>
        
        <div className="card-footer flex justify-between">
          <button onClick={onBack} className="btn btn-outline">
            Back
          </button>
          <button onClick={onNext} className="btn btn-primary">
            Review & Export
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuestionEditor;