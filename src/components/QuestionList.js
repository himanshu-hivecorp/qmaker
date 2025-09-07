import React from 'react';
import { Edit2, Trash2, CheckCircle, ChevronUp, ChevronDown, Globe } from 'lucide-react';
import { getOptionLabel, getQuestionPrefix } from '../utils/languageOptions';

function QuestionList({ questions, onEdit, onDelete, onMove }) {
  if (questions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No questions added yet.</p>
        <p className="text-sm mt-2">Add your first question to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {questions.map((q, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                {getQuestionPrefix(q.language)}{index + 1}
              </span>
              {q.language && q.language !== 'english' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  <Globe className="h-3 w-3 mr-1" />
                  {q.language === 'hindi' ? 'हि' : q.language === 'odia' ? 'ଓ' : 'En'}
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => onMove(index, index - 1)}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move up"
                disabled={index === 0}
              >
                <ChevronUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => onMove(index, index + 1)}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Move down"
                disabled={index === questions.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => onEdit(index)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit question"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete question"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-800 font-medium mb-2 overflow-hidden" style={{ 
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {q.question}
          </p>
          
          <div className="space-y-1">
            {q.options.map((option, optIndex) => (
              <div
                key={optIndex}
                className={`flex items-center space-x-2 text-xs ${
                  q.correctAnswer === optIndex ? 'text-green-600 font-medium' : 'text-gray-600'
                }`}
              >
                <span className="flex-shrink-0">
                  {getOptionLabel(optIndex, q.language)}.
                </span>
                <span className="truncate">{option}</span>
                {q.correctAnswer === optIndex && (
                  <CheckCircle className="h-3 w-3 flex-shrink-0" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default QuestionList;