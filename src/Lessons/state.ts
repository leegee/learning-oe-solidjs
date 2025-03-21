const LOG_PREFIX = 'Storage ';
const STORAGE_PREFIX = 'oe_';

const keys = {
  CURRENT_LESSON_INDEX: STORAGE_PREFIX + 'current_lesson_index',
  ANSWERS: STORAGE_PREFIX + 'answers',
};

interface Answers {
  [lessonIndex: number]: string[];
}

const storageHandler = {
  get(target: Record<string, any>, prop: string) {
    // Ensure the property exists in the target or localStorage
    if (!(prop in target)) {
      const storedValue = localStorage.getItem(prop);
      // Return an empty object/array if no stored value is found
      target[prop] = storedValue ? JSON.parse(storedValue) : (prop === keys.ANSWERS ? {} : 0);
    }
    return target[prop];
  },
  set(target: Record<string, any>, prop: string, value: any) {
    target[prop] = value;
    localStorage.setItem(prop, JSON.stringify(value));
    console.log(LOG_PREFIX + `updated ${prop}`, value);
    return true;
  },
};

const state = new Proxy({}, storageHandler);

const getLessonAnswers = (lessonIndex: number): string[] => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return answers[lessonIndex] || [];
};

export const getTotalLessons = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.keys(answers).length; // Total lessons = number of keys in the answers object
};

export const currentLessonIndex = (lessonIndex?: number): number => {
  if (typeof lessonIndex === 'number' && !isNaN(lessonIndex)) {
    state[keys.CURRENT_LESSON_INDEX] = lessonIndex;
  }
  return state[keys.CURRENT_LESSON_INDEX] ?? 0;
};

export const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer?: string) => {
  const savedAnswers: Answers = state[keys.ANSWERS] ?? {};
  savedAnswers[lessonIndex] = savedAnswers[lessonIndex] || [];
  savedAnswers[lessonIndex][cardIndex] = incorrectAnswer || '';
  state[keys.ANSWERS] = savedAnswers;
};

export const resetLesson = (lessonIndex: number): void => {
  const savedAnswers: Answers = state[keys.ANSWERS] ?? {};
  savedAnswers[lessonIndex] = [];
  state[keys.ANSWERS] = savedAnswers;
};

export const getTotalQuestionsAnswered = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.values(answers).reduce((total, lessonAnswers) => total + lessonAnswers.length, 0);
};

export const getTotalCorrectAnswers = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.values(answers).reduce(
    (total, lessonAnswers) => total + lessonAnswers.filter((answer: string) => answer === "").length,
    0
  );
};

export const getTotalIncorrectAnswers = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.values(answers).reduce((total, lessonAnswers) => {
    return total + lessonAnswers.filter((answer: string) => answer !== '').length;
  }, 0);
};

export const getLessonQuestionCount = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.length;
};

export const countLessonAnswersIncorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.filter(answer => answer !== "").length;
};

export const countLessonAnswersCorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.filter(answer => answer === "").length;
};
