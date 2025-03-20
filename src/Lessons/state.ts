const LOG_PREFIX = 'Storage saved ';
const STORAGE_PREFIX = 'oe_';

const keys = {
  CURRENT_LESSON: STORAGE_PREFIX + 'current_lesson',
  INCORRECT_ANSWERS: STORAGE_PREFIX + 'incorrect_answers',
  CORRECT_ANSWERS: STORAGE_PREFIX + 'correct_answers',
  QUESTIONS_ANSWERED: STORAGE_PREFIX + 'questions_answered',
};

export const saveCurrentLessonIndex = (lessonIndex: number): void => {
  localStorage.setItem(keys.CURRENT_LESSON, lessonIndex.toString());
  console.log(LOG_PREFIX + 'saved lesson index', lessonIndex);
};

export const loadCurrentLessonIndex = (): number => {
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
  console.log(LOG_PREFIX + 'saved incorrect answers for lesson', lessonIndex, savedAnswers);
  return savedAnswers;
};

export const resetLesson = (lessonIndex: number): void => {
  saveIncorrectAnswers(lessonIndex, []);
  console.log(LOG_PREFIX + 'reset lesson', lessonIndex);
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
  const rv = Object.values(parsedData).reduce((total, answers) => total + answers.length, 0);
  console.log(LOG_PREFIX + 'found total incorrect answers', rv);
  return rv;
};

export const loadQuestionsAnswered = (): number => {
  const storedData = localStorage.getItem(keys.QUESTIONS_ANSWERED);
  return storedData ? Number(storedData) : 0;
}

export const addQuestionCompleted = (): number => {
  const newCount = loadQuestionsAnswered() + 1;
  localStorage.setItem(keys.QUESTIONS_ANSWERED, String(newCount));
  console.log(LOG_PREFIX + 'added a question answer, total answered now', newCount);
  return newCount;
};

export const loadCorrectAnswers = (): number => {
  const storedData = localStorage.getItem(keys.CORRECT_ANSWERS);
  return storedData ? Number(storedData) : 0;
}

export const addCorrectAnswer = (): number => {
  const parsedData = loadCorrectAnswers();
  const newCount = parsedData + 1;
  localStorage.setItem(keys.CORRECT_ANSWERS, String(newCount));
  console.log(LOG_PREFIX + 'added an correct answer, total correct now', newCount)
  return newCount;
};

