import React, { useState } from 'react';
import { Calculator, Superscript, Subscript, Divide, X } from 'lucide-react';

function MathInput({ value, onChange, onClose }) {
  const [mathText, setMathText] = useState(value || '');
  const [showHelp, setShowHelp] = useState(false);

  const insertSymbol = (symbol) => {
    setMathText(prev => prev + symbol);
  };

  const insertTemplate = (before, after) => {
    const textarea = document.getElementById('math-textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = mathText;
    const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end);
    setMathText(newText);
    
    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length;
      textarea.focus();
    }, 0);
  };

  const mathSymbols = [
    { symbol: '×', label: 'Multiply' },
    { symbol: '÷', label: 'Divide' },
    { symbol: '±', label: 'Plus/Minus' },
    { symbol: '√', label: 'Square Root' },
    { symbol: '∛', label: 'Cube Root' },
    { symbol: 'π', label: 'Pi' },
    { symbol: '∞', label: 'Infinity' },
    { symbol: '≈', label: 'Approximately' },
    { symbol: '≠', label: 'Not Equal' },
    { symbol: '≤', label: 'Less or Equal' },
    { symbol: '≥', label: 'Greater or Equal' },
    { symbol: '∈', label: 'Element of' },
    { symbol: '∉', label: 'Not Element of' },
    { symbol: '∪', label: 'Union' },
    { symbol: '∩', label: 'Intersection' },
    { symbol: '⊂', label: 'Subset' },
    { symbol: '⊃', label: 'Superset' },
    { symbol: '∴', label: 'Therefore' },
    { symbol: '∵', label: 'Because' },
    { symbol: '∠', label: 'Angle' },
    { symbol: '⊥', label: 'Perpendicular' },
    { symbol: '∥', label: 'Parallel' },
    { symbol: '△', label: 'Triangle' },
    { symbol: '□', label: 'Square' },
    { symbol: '∑', label: 'Sum' },
    { symbol: '∏', label: 'Product' },
    { symbol: '∫', label: 'Integral' },
    { symbol: '∂', label: 'Partial' },
    { symbol: 'α', label: 'Alpha' },
    { symbol: 'β', label: 'Beta' },
    { symbol: 'γ', label: 'Gamma' },
    { symbol: 'δ', label: 'Delta' },
    { symbol: 'θ', label: 'Theta' },
    { symbol: 'λ', label: 'Lambda' },
    { symbol: 'μ', label: 'Mu' },
    { symbol: 'σ', label: 'Sigma' },
    { symbol: 'φ', label: 'Phi' },
    { symbol: 'ω', label: 'Omega' }
  ];

  const handleApply = () => {
    onChange(mathText);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Math & Symbol Input
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          {/* Quick Insert Buttons */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Quick Templates:</div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => insertTemplate('x²', '')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                x² (Superscript)
              </button>
              <button
                onClick={() => insertTemplate('x₂', '')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                x₂ (Subscript)
              </button>
              <button
                onClick={() => insertTemplate('(', ')')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                ( ) Parentheses
              </button>
              <button
                onClick={() => insertTemplate('[', ']')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                [ ] Brackets
              </button>
              <button
                onClick={() => insertTemplate('{', '}')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                { } Braces
              </button>
              <button
                onClick={() => insertTemplate('|', '|')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                | | Absolute
              </button>
              <button
                onClick={() => insertTemplate('√(', ')')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                √( ) Square Root
              </button>
              <button
                onClick={() => insertTemplate('', '/')}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
              >
                Fraction a/b
              </button>
            </div>
          </div>

          {/* Text Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your text with math symbols:
            </label>
            <textarea
              id="math-textarea"
              value={mathText}
              onChange={(e) => setMathText(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Type or insert mathematical expressions..."
            />
          </div>

          {/* Symbol Grid */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Mathematical Symbols:</div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-1">
              {mathSymbols.map((item, index) => (
                <button
                  key={index}
                  onClick={() => insertSymbol(item.symbol)}
                  className="p-2 text-lg hover:bg-gray-100 border border-gray-200 rounded transition-colors"
                  title={item.label}
                >
                  {item.symbol}
                </button>
              ))}
            </div>
          </div>

          {/* Superscript and Subscript Numbers */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Superscripts & Subscripts:</div>
            <div className="flex flex-wrap gap-2">
              <div>
                <span className="text-xs text-gray-600 mr-2">Superscript:</span>
                {['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'].map(sup => (
                  <button
                    key={sup}
                    onClick={() => insertSymbol(sup)}
                    className="px-2 py-1 hover:bg-gray-100 border border-gray-200 rounded mx-1"
                  >
                    {sup}
                  </button>
                ))}
              </div>
              <div>
                <span className="text-xs text-gray-600 mr-2">Subscript:</span>
                {['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'].map(sub => (
                  <button
                    key={sub}
                    onClick={() => insertSymbol(sub)}
                    className="px-2 py-1 hover:bg-gray-100 border border-gray-200 rounded mx-1"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Preview:</div>
            <div className="p-4 bg-gray-50 rounded border border-gray-200 min-h-[60px] whitespace-pre-wrap">
              {mathText || 'Your text will appear here...'}
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="text-blue-600 hover:underline"
            >
              {showHelp ? 'Hide' : 'Show'} formatting tips
            </button>
            {showHelp && (
              <div className="mt-2 p-3 bg-blue-50 rounded">
                <p>• Use superscript numbers for powers: x² + y³</p>
                <p>• Use subscript for chemical formulas: H₂O, CO₂</p>
                <p>• Combine symbols for complex expressions: ∫₀^∞ e^(-x²) dx</p>
                <p>• Use parentheses for clarity: √(a² + b²)</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default MathInput;