// const LOG_PREFIX = 'Storage ';
const STORAGE_PREFIX = 'oe_';

const keys = {
  CURRENT_LESSON_INDEX: STORAGE_PREFIX + 'current_lesson_index',
  ANSWERS: STORAGE_PREFIX + 'answers',
};

interface Answers {
  [lessonIndex: number]: string[][]; // Structure of answers (lesson index -> card answers)
}

export const setCurrentLessonIndex = (lessonIndex: number) => {
  localStorage.setItem(keys.CURRENT_LESSON_INDEX, String(lessonIndex));
}

export const getCurrentLessonIndex = () => {
  return JSON.parse(localStorage.getItem(keys.CURRENT_LESSON_INDEX) || '0');
}

export const getLessonAnswers = (lessonIndex: number): string[][] => {
  let answers: Answers = {};

  try {
    answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || "{}");
  } catch (error) {
    console.error("Error parsing lesson answers:", error);
  }

  return answers[lessonIndex] ?? [];
};

export const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer: string = ""): void => {
  const savedAnswers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  savedAnswers[lessonIndex] ??= [];
  if (!savedAnswers[lessonIndex][cardIndex]) {
    while (savedAnswers[lessonIndex].length <= cardIndex) {
      savedAnswers[lessonIndex].push([]);
    }
  }
  savedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);

  // Save updated answers to localStorage
  localStorage.setItem(keys.ANSWERS, JSON.stringify(savedAnswers));
};

// Reset all state and clear from localStorage
export const resetAll = () => {
  localStorage.removeItem(keys.CURRENT_LESSON_INDEX);
  localStorage.removeItem(keys.ANSWERS);
  setCurrentLessonIndex(0);
};

// Reset answers for a specific lesson
export const resetLesson = (lessonIndex: number): void => {
  const savedAnswers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  if (savedAnswers[lessonIndex]) {
    savedAnswers[lessonIndex] = [];
    localStorage.setItem(keys.ANSWERS, JSON.stringify(savedAnswers));
  }
};

// Get total lessons based on answers stored in localStorage
export const getTotalTakenLessons = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  return Object.keys(answers).length;
};

// Get the total number of questions answered across all lessons
export const getTotalQuestionsAnswered = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.length : 0),
    0
  );
};

// Get the total number of correct answers
export const getTotalCorrectAnswers = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0), 0) : 0),
    0
  );
};

// Get the total number of incorrect answers
export const getTotalIncorrectAnswers = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0), 0) : 0),
    0
  );
};

// Get the total number of questions in a particular lesson
export const getLessonQuestionCount = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.length;
};

// Count the number of incorrect answers for a particular lesson
export const getLessonQuestionsAnsweredIncorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
    0
  );
};

// Count the number of correct answers for a particular lesson
export const getLessonQuestionsAnsweredCcorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
    0
  );
};





