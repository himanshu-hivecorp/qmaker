export const optionLabels = {
  english: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  hindi: ['क', 'ख', 'ग', 'घ', 'ङ', 'च', 'छ', 'ज'],
  odia: ['କ', 'ଖ', 'ଗ', 'ଘ', 'ଙ', 'ଚ', 'ଛ', 'ଜ']
};

export const getOptionLabel = (index, language = 'english') => {
  return optionLabels[language][index] || optionLabels.english[index];
};

export const questionHeaders = {
  english: 'Q',
  hindi: 'प्र',
  odia: 'ପ୍ର'
};

export const getQuestionPrefix = (language = 'english') => {
  return questionHeaders[language] || questionHeaders.english;
};