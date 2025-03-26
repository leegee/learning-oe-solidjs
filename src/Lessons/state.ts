import { createSignal, createEffect } from "solid-js";

// const LOG_PREFIX = 'Storage ';
const STORAGE_PREFIX = 'oe_';

const keys = {
  CURRENT_LESSON_INDEX: STORAGE_PREFIX + 'current_lesson_index',
  ANSWERS: STORAGE_PREFIX + 'answers',
};

interface Answers {
  [lessonIndex: number]: string[][]; // Structure of answers (lesson index -> card answers)
}

// Reactive state hooks for lesson data
export const [currentLessonIndex, setCurrentLessonIndex] = createSignal(
  JSON.parse(localStorage.getItem(keys.CURRENT_LESSON_INDEX) || "0")
);

// Calculate the total questions answered
const calculateTotalQuestionsAnswered = (answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}')) => {
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) => total + (lessonAnswers ? lessonAnswers.length : 0),
    0
  );
};

const [, setTotalQuestionsAnswered] = createSignal(
  calculateTotalQuestionsAnswered()
);

// Recalculate the total questions answered whenever the answers are updated
createEffect(() => {
  const answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  setTotalQuestionsAnswered(calculateTotalQuestionsAnswered(answers));
});


// Functions to handle answers and lesson updates
export const getLessonAnswers = (lessonIndex: number): string[][] => {
  const answers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
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

  // Trigger reactivity for total questions answered
  setTotalQuestionsAnswered(calculateTotalQuestionsAnswered(savedAnswers));
};

// Reset all state and clear from localStorage
export const resetAll = () => {
  localStorage.removeItem(keys.CURRENT_LESSON_INDEX);
  localStorage.removeItem(keys.ANSWERS);
  setCurrentLessonIndex(0);
  setTotalQuestionsAnswered(0);
};

// Reset answers for a specific lesson
export const resetLesson = (lessonIndex: number): void => {
  const savedAnswers: Answers = JSON.parse(localStorage.getItem(keys.ANSWERS) || '{}');
  savedAnswers[lessonIndex] = [];

  // Save updated answers to localStorage
  localStorage.setItem(keys.ANSWERS, JSON.stringify(savedAnswers));

  // Recalculate total questions answered
  setTotalQuestionsAnswered(calculateTotalQuestionsAnswered(savedAnswers));
};

// Get total lessons based on answers stored in localStorage
export const getTotalLessons = (): number => {
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
export const countLessonAnswersIncorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
    0
  );
};

// Count the number of correct answers for a particular lesson
export const countLessonAnswersCorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
    0
  );
};
