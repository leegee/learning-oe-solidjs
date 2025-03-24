const LOG_PREFIX = 'Storage ';
const STORAGE_PREFIX = 'oe_';

const keys = {
  CURRENT_LESSON_INDEX: STORAGE_PREFIX + 'current_lesson_index',
  ANSWERS: STORAGE_PREFIX + 'answers',
};

// Answers structure: Each lesson has an array of cards, each card has an array of answers
interface Answers {
  [lessonIndex: number]: string[][];
}

const storageHandler: ProxyHandler<Record<string, any>> = {
  get(target: Record<string, any>, prop: string) {
    if (!(prop in target)) {
      const storedValue = localStorage.getItem(prop);
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

const state = new Proxy<Record<string, any>>({}, storageHandler);

const getLessonAnswers = (lessonIndex: number): string[][] => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return answers[lessonIndex] ?? [];
};

export const getTotalLessons = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.keys(answers).length;
};

export const currentLessonIndex = (lessonIndex?: number): number => {
  if (typeof lessonIndex === 'number' && !isNaN(lessonIndex)) {
    state[keys.CURRENT_LESSON_INDEX] = lessonIndex;
  }
  return state[keys.CURRENT_LESSON_INDEX] ?? 0;
};

export const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer: string = ""): void => {
  const savedAnswers: Answers = state[keys.ANSWERS] ?? {};

  if (!Array.isArray(savedAnswers[lessonIndex])) {
    savedAnswers[lessonIndex] = [];
  }

  if (!Array.isArray(savedAnswers[lessonIndex][cardIndex])) {
    savedAnswers[lessonIndex][cardIndex] = [];
  }

  savedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);
  state[keys.ANSWERS] = savedAnswers;
};

export const resetLesson = (lessonIndex: number): void => {
  const savedAnswers: Answers = state[keys.ANSWERS] ?? {};
  savedAnswers[lessonIndex] = [];
  state[keys.ANSWERS] = savedAnswers;
};

export const getTotalQuestionsAnswered = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.length : 0),
    0
  );
};

export const getTotalCorrectAnswers = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
  return Object.values(answers).reduce(
    (total: number, lessonAnswers: string[][]) =>
      total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0), 0) : 0),
    0
  );
};

export const getTotalIncorrectAnswers = (): number => {
  const answers: Answers = state[keys.ANSWERS] ?? {};
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

export const countLessonAnswersIncorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
    0
  );
};

export const countLessonAnswersCorrect = (lessonIndex: number): number => {
  const lessonAnswers = getLessonAnswers(lessonIndex);
  return lessonAnswers.reduce(
    (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
    0
  );
};
