const STORAGE_PREFIX = 'oe_';

const storageKeys = {
  CURRENT_LESSON_INDEX: (courseId: number) => `${STORAGE_PREFIX}current_lesson_index_${courseId}`,
  ANSWERS: (courseId: number) => `${STORAGE_PREFIX}answers_${courseId}`,
  COURSE_INDEX: `${STORAGE_PREFIX}course`,
};

// Interface for answers
interface Answers {
  [lessonIndex: number]: string[][]; // Structure of answers (lesson index -> card answers)
}

let courseId: number = getCourseIndex();

export const setCurrentLessonIndex = (lessonIndex: number) => {
  localStorage.setItem(storageKeys.CURRENT_LESSON_INDEX(courseId), String(lessonIndex));
};

export const getCurrentLessonIndex = () => {
  return JSON.parse(localStorage.getItem(storageKeys.CURRENT_LESSON_INDEX(courseId)) || '0');
};

export const getLessonAnswers = (lessonIndex: number): string[][] => {
  let answers: Answers = {};

  try {
    answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || "{}");
  } catch (error) {
    console.error("Error parsing lesson answers:", error);
  }

  return answers[lessonIndex] ?? [];
};

export const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer: string = ""): void => {
  const savedAnswers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  savedAnswers[lessonIndex] ??= [];

  if (!savedAnswers[lessonIndex][cardIndex]) {
    while (savedAnswers[lessonIndex].length <= cardIndex) {
      savedAnswers[lessonIndex].push([]);
    }
  }

  savedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);

  localStorage.setItem(storageKeys.ANSWERS(courseId), JSON.stringify(savedAnswers));
};

// Reset all state and clear from localStorage for a specific course
export const resetCourse = () => {
  localStorage.removeItem(storageKeys.CURRENT_LESSON_INDEX(courseId));
  localStorage.removeItem(storageKeys.ANSWERS(courseId));
  setCurrentLessonIndex(0);
};

export const resetLesson = (lessonIndex: number): void => {
  const savedAnswers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  if (savedAnswers[lessonIndex]) {
    savedAnswers[lessonIndex] = [];
    localStorage.setItem(storageKeys.ANSWERS(courseId), JSON.stringify(savedAnswers));
  }
};

export const getTotalTakenLessons = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  return Object.keys(answers).length;
};

export const getTotalQuestionsAnswered = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.length : 0),
    0
  );
};

export const getTotalCorrectAnswers = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0), 0) : 0),
    0
  );
};

export const getTotalIncorrectAnswers = (): number => {
  const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseId)) || '{}');
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0), 0) : 0),
    0
  );
};

export const getLessonQuestionCount = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.length;
};

export const getLessonQuestionsAnsweredIncorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
    0
  );
};

export const getLessonQuestionsAnsweredCorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
    0
  );
};

export function getCourseIndex() {
  const savedIndex = localStorage.getItem(storageKeys.COURSE_INDEX);
  return savedIndex === null ? 0 : parseInt(savedIndex, 10);
};

export const setCourseIndex = (index: number) => {
  courseId = index;
  localStorage.setItem(storageKeys.COURSE_INDEX, index.toString());
};
