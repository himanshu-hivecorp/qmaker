import React from 'react';
import { FileText } from 'lucide-react';
import { getOptionLabel, getQuestionPrefix } from '../utils/languageOptions';

function Preview({ questions, optionLayout, paperName, layoutSettings = {} }) {
  const renderOptions = (options, correctAnswer, language = 'english') => {
    const optionElements = options.map((option, index) => (
      <div 
        key={index} 
        className="flex items-start"
        style={{ 
          fontSize: `${layoutSettings.optionSize || 14}px`,
          lineHeight: layoutSettings.lineSpacing || 1.5
        }}
      >
        <span className="font-medium mr-2">
          ({getOptionLabel(index, language)})
        </span>
        <span>{option}</span>
      </div>
    ));

    switch (optionLayout) {
      case 'horizontal':
        return (
          <div className="flex flex-wrap gap-x-6 gap-y-2 ml-6">
            {optionElements}
          </div>
        );
      
      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 ml-6 max-w-2xl">
            {optionElements}
          </div>
        );
      
      case 'vertical':
      default:
        return (
          <div className="space-y-2 ml-6">
            {optionElements}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <FileText className="h-5 w-5 mr-2" />
          Question Paper Preview
        </h2>
      </div>
      
      <div 
        id="question-paper-preview" 
        className="bg-white"
        style={{ 
          fontFamily: layoutSettings.fontFamily || 'Times New Roman, serif',
          padding: `${layoutSettings.marginSize || 32}px`,
          minHeight: '800px',
          fontSize: layoutSettings.fontSize === 'small' ? '14px' : 
                   layoutSettings.fontSize === 'large' ? '18px' : 
                   layoutSettings.fontSize === 'extra-large' ? '20px' : '16px'
        }}
      >
        {questions.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>Your question paper preview will appear here</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8 pb-4 border-b-2 border-gray-300">
              <h1 
                className="font-bold mb-2"
                style={{ fontSize: `${parseInt(layoutSettings.questionSize || 16) + 8}px` }}
              >
                {paperName || 'QUESTION PAPER'}
              </h1>
              <p className="text-gray-600" style={{ fontSize: `${layoutSettings.optionSize || 14}px` }}>
                Total Questions: {questions.length}
              </p>
            </div>
            
            <div style={{ marginBottom: `${layoutSettings.questionSpacing || 24}px` }}>
              {questions.map((q, index) => (
                <div 
                  key={index} 
                  className="break-inside-avoid"
                  style={{ marginBottom: `${layoutSettings.questionSpacing || 24}px` }}
                >
                  <div className="flex items-start">
                    <span 
                      className="font-bold mr-3"
                      style={{ 
                        fontSize: `${layoutSettings.questionSize || 16}px`,
                        lineHeight: layoutSettings.lineSpacing || 1.5
                      }}
                    >
                      {getQuestionPrefix(q.language)}{index + 1}.
                    </span>
                    <div className="flex-1">
                      <p 
                        className="mb-3"
                        style={{ 
                          fontSize: `${layoutSettings.questionSize || 16}px`,
                          lineHeight: layoutSettings.lineSpacing || 1.5
                        }}
                      >
                        {q.question}
                      </p>
                      {renderOptions(q.options, q.correctAnswer, q.language)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 pt-6 border-t-2 border-gray-300">
              <p 
                className="text-center text-gray-600"
                style={{ fontSize: `${layoutSettings.optionSize || 14}px` }}
              >
                *** End of Question Paper ***
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Preview;