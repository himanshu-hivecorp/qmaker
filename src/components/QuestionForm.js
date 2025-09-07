import React, { useState, useEffect } from 'react';
import { Plus, X, Check, Edit2, Globe, Calculator } from 'lucide-react';
import { getOptionLabel, getQuestionPrefix } from '../utils/languageOptions';
import MathInput from './MathInput';

function QuestionForm({ onAddQuestion, editingQuestion, onCancelEdit }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [language, setLanguage] = useState('english');
  const [showMathInput, setShowMathInput] = useState(false);
  const [mathInputTarget, setMathInputTarget] = useState(null);
  const [mathInputValue, setMathInputValue] = useState('');

  useEffect(() => {
    if (editingQuestion) {
      setQuestion(editingQuestion.question);
      setOptions(editingQuestion.options);
      setCorrectAnswer(editingQuestion.correctAnswer);
      setLanguage(editingQuestion.language || 'english');
    }
  }, [editingQuestion]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }
    
    if (options.some(opt => !opt.trim())) {
      alert('Please fill all options');
      return;
    }
    
    if (correctAnswer === null) {
      alert('Please select the correct answer');
      return;
    }

    onAddQuestion({
      question: question.trim(),
      options: options.map(opt => opt.trim()),
      correctAnswer,
      language
    });

    resetForm();
  };

  const resetForm = () => {
    setQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer(null);
    setLanguage('english');
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const openMathInput = (target, currentValue) => {
    setMathInputTarget(target);
    setMathInputValue(currentValue || '');
    setShowMathInput(true);
  };

  const handleMathInputSave = (value) => {
    if (mathInputTarget === 'question') {
      setQuestion(value);
    } else if (mathInputTarget && mathInputTarget.startsWith('option-')) {
      const index = parseInt(mathInputTarget.split('-')[1]);
      handleOptionChange(index, value);
    }
    setShowMathInput(false);
    setMathInputTarget(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          {editingQuestion ? (
            <>
              <Edit2 className="h-5 w-5 mr-2" />
              Edit Question
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Add Question
            </>
          )}
        </h2>
        {editingQuestion && (
          <button
            onClick={handleCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Globe className="inline h-4 w-4 mr-1" />
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi (हिन्दी)</option>
            <option value="odia">Odia (ଓଡ଼ିଆ)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question
          </label>
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows="3"
              placeholder="Enter your question here..."
            />
            <button
              type="button"
              onClick={() => openMathInput('question', question)}
              className="absolute right-2 top-2 p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
              title="Insert math symbols"
            >
              <Calculator className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                  {getOptionLabel(index, language)}
                </span>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder={`Option ${getOptionLabel(index, language)}`}
                  />
                  <button
                    type="button"
                    onClick={() => openMathInput(`option-${index}`, option)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                    title="Insert math symbols"
                  >
                    <Calculator className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setCorrectAnswer(index)}
                  className={`p-2 rounded-md transition-colors ${
                    correctAnswer === index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title="Mark as correct answer"
                >
                  <Check className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
          {correctAnswer !== null && (
            <p className="mt-2 text-sm text-green-600">
              Correct answer: Option {getOptionLabel(correctAnswer, language)}
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors font-medium"
          >
            {editingQuestion ? 'Update Question' : 'Add Question'}
          </button>
          {editingQuestion && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {showMathInput && (
        <MathInput
          value={mathInputValue}
          onChange={handleMathInputSave}
          onClose={() => setShowMathInput(false)}
        />
      )}
    </div>
  );
}

export default QuestionForm;