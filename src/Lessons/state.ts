// Save incorrect answers for a specific lesson (mapping lesson index to incorrect answers)
const prefix = 'oe_';

const keys = {
  CURRENT_LESSON: prefix + 'current_lesson',
  INCORRECT_ANSWERS: prefix + 'incorrect_answers',
  CORRECT_ANSWERS: prefix + 'correct_answers',
  QUESTIONS_ANSWERED: prefix + 'questions_answered',
};

// Save current lesson index (number)
export const saveCurrentLesson = (lessonIndex: number): void => {
  localStorage.setItem(keys.CURRENT_LESSON, lessonIndex.toString());
};

// Load current lesson index (defaults to 0 if not found)
export const loadCurrentLesson = (): number => {
  return parseInt(localStorage.getItem(keys.CURRENT_LESSON) || '0', 10);
};


// Load incorrect answers for a specific lesson (returns string[] for that lesson)
export const saveIncorrectAnswers = (lessonIndex: number, incorrectAnswers: string[]): void => {
  let savedAnswers = JSON.parse(localStorage.getItem(keys.INCORRECT_ANSWERS) || '{"0":{}}');
  if (!savedAnswers) {
    savedAnswers = {};
  }
  savedAnswers[lessonIndex] = incorrectAnswers;

  localStorage.setItem(keys.INCORRECT_ANSWERS, JSON.stringify(savedAnswers));
  console.log('state saved incorrect answers', JSON.stringify(savedAnswers));
  return savedAnswers;
};

export const resetLesson = (lessonIndex: number): void => {
  saveIncorrectAnswers(lessonIndex, []);
};

export const loadIncorrectAnswers = (lessonIndex: number): string[] => {
  const storedData = localStorage.getItem(keys.INCORRECT_ANSWERS);
  const parsedData = storedData ? JSON.parse(storedData) : {};
  const incorrectAnswers = parsedData[lessonIndex] || [];
  return incorrectAnswers;
};

export const countTotalIncorrectAnswers = (): number => {
  const storedData = localStorage.getItem(keys.INCORRECT_ANSWERS);
  const parsedData: Record<number, string[]> = storedData ? JSON.parse(storedData) : {};

  // Sum up the lengths of all incorrect answer arrays
  return Object.values(parsedData).reduce((total, answers) => total + answers.length, 0);
};

export const loadQuestionsAnswered = (): number => {
  const storedData = localStorage.getItem(keys.QUESTIONS_ANSWERED);
  return storedData ? Number(storedData) : 0;
}

export const addQuestionCompleted = (): number => {
  const newCount = loadQuestionsAnswered() + 1;
  localStorage.setItem(keys.QUESTIONS_ANSWERED, String(newCount));
  return newCount;
};

export const loadCorrectAnswers = (): number => {
  const storedData = localStorage.getItem(keys.CORRECT_ANSWERS);
  return storedData ? Number(storedData) : 0;
}

export const addCorrectAnswers = (numberOfCorrectAnswersToAdd = 1): number => {
  const parsedData = loadCorrectAnswers();
  const newCount = parsedData + numberOfCorrectAnswersToAdd;
  localStorage.setItem(keys.CORRECT_ANSWERS, String(newCount));
  console.log('added', numberOfCorrectAnswersToAdd, 'to reach', newCount, 'correct answers')
  return newCount;
};

