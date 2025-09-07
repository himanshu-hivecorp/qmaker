import React, { useRef } from 'react';
import { Save, Upload, Download, FileJson } from 'lucide-react';
import { saveAs } from 'file-saver';

function SaveLoadWork({ questions, paperName, layoutSettings, optionLayout, onLoad }) {
  const fileInputRef = useRef(null);

  const saveWork = () => {
    const workData = {
      version: '1.0',
      timestamp: new Date().toISOString(),
      paperName,
      questions,
      layoutSettings,
      optionLayout,
      metadata: {
        totalQuestions: questions.length,
        savedAt: new Date().toLocaleString()
      }
    };

    const blob = new Blob([JSON.stringify(workData, null, 2)], {
      type: 'application/json'
    });

    const fileName = paperName 
      ? `${paperName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_work.qpg`
      : 'question_paper_work.qpg';

    saveAs(blob, fileName);
  };

  const loadWork = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workData = JSON.parse(e.target.result);
        
        if (!workData.version || !workData.questions) {
          alert('Invalid file format. Please select a valid QPG file.');
          return;
        }

        onLoad(workData);
        alert(`Successfully loaded "${workData.paperName || 'Question Paper'}" with ${workData.questions.length} questions.`);
      } catch (error) {
        alert('Error loading file. Please ensure it is a valid QPG file.');
        console.error('Load error:', error);
      }
    };

    reader.readAsText(file);
    event.target.value = ''; // Reset input
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={saveWork}
        className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        title="Save your work"
      >
        <Save className="h-4 w-4" />
        <span className="hidden sm:inline">Save Work</span>
      </button>

      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        title="Load saved work"
      >
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Load Work</span>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept=".qpg,.json"
        onChange={loadWork}
        className="hidden"
      />
    </div>
  );
}

export default SaveLoadWork;