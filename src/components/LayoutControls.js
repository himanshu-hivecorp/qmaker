import React from 'react';
import { Type, AlignJustify, Move, X, RotateCcw } from 'lucide-react';

function LayoutControls({ settings, onSettingsChange, onClose }) {
  const handleChange = (key, value) => {
    onSettingsChange({
      ...settings,
      [key]: value
    });
  };

  const resetToDefaults = () => {
    onSettingsChange({
      fontSize: 'medium',
      questionSize: '16',
      optionSize: '14',
      fontFamily: 'serif',
      lineSpacing: '1.5',
      questionSpacing: '24',
      marginSize: '32'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Type className="h-5 w-5 mr-2" />
          Layout & Typography Settings
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefaults}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Reset to defaults"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
            title="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Font Family
          </label>
          <select
            value={settings.fontFamily}
            onChange={(e) => handleChange('fontFamily', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="serif">Times New Roman</option>
            <option value="sans-serif">Arial</option>
            <option value="system-ui">System Font</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Courier New', monospace">Courier New</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          </select>
        </div>

        {/* Overall Font Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Overall Size
          </label>
          <select
            value={settings.fontSize}
            onChange={(e) => handleChange('fontSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </div>

        {/* Question Text Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Size (px)
          </label>
          <input
            type="number"
            min="12"
            max="24"
            value={settings.questionSize}
            onChange={(e) => handleChange('questionSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Option Text Size */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Option Size (px)
          </label>
          <input
            type="number"
            min="10"
            max="20"
            value={settings.optionSize}
            onChange={(e) => handleChange('optionSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Line Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <AlignJustify className="inline h-4 w-4 mr-1" />
            Line Spacing
          </label>
          <select
            value={settings.lineSpacing}
            onChange={(e) => handleChange('lineSpacing', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="1">Single (1.0)</option>
            <option value="1.15">Slightly Loose (1.15)</option>
            <option value="1.5">1.5 Lines</option>
            <option value="2">Double (2.0)</option>
          </select>
        </div>

        {/* Question Spacing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Move className="inline h-4 w-4 mr-1" />
            Question Gap (px)
          </label>
          <input
            type="number"
            min="16"
            max="48"
            value={settings.questionSpacing}
            onChange={(e) => handleChange('questionSpacing', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Page Margins */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Page Margins (px)
          </label>
          <input
            type="number"
            min="16"
            max="64"
            value={settings.marginSize}
            onChange={(e) => handleChange('marginSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Preview Text */}
      <div className="mt-4 p-4 bg-gray-50 rounded-md">
        <p className="text-xs text-gray-600 mb-2">Preview:</p>
        <div 
          style={{ 
            fontFamily: settings.fontFamily,
            lineHeight: settings.lineSpacing
          }}
        >
          <p style={{ fontSize: `${settings.questionSize}px`, marginBottom: '8px' }}>
            This is how your question text will appear
          </p>
          <p style={{ fontSize: `${settings.optionSize}px`, paddingLeft: '20px' }}>
            (A) This is how options will look
          </p>
        </div>
      </div>
    </div>
  );
}

export default LayoutControls;