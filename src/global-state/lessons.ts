import { createStore } from 'solid-js/store';
import { storageKeys } from './keys';

interface Answers {
  [lessonIndex: number]: string[][]; // (lesson index -> card answers)
}

const loadFromLocalStorage = (courseIdx: number): Answers => {
  try {
    const savedAnswers = JSON.parse(
      localStorage.getItem(storageKeys.ANSWERS(courseIdx)) || '{}'
    );
    return savedAnswers;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

const saveToLocalStorage = (courseIdx: number, answers: Answers): void => {
  try {
    localStorage.setItem(storageKeys.ANSWERS(courseIdx), JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getLessonIdx = (courseIdx: number): number => {
  return JSON.parse(localStorage.getItem(storageKeys.CURRENT_LESSON_INDEX(courseIdx)) || '0');
};

const setLessonIdx = (courseIdx: number, lessonIndex: number): void => {
  localStorage.setItem(storageKeys.CURRENT_LESSON_INDEX(courseIdx), String(lessonIndex));
};

export const useLessonStore = (courseIdx: number) => {
  const [state, setState] = createStore({
    lessonIndex: getLessonIdx(courseIdx),
    answers: loadFromLocalStorage(courseIdx),
  });

  const updateLessonIdx = (courseIdx: number, newLessonIndex: number) => {
    setState('lessonIndex', newLessonIndex);
    setLessonIdx(courseIdx, newLessonIndex);
  };

  const saveAnswer = (
    courseIdx: number,
    lessonIdx: number,
    cardIdx: number,
    incorrectAnswer: string = ''
  ): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIdx] ??= [];

    while (updatedAnswers[lessonIdx].length <= cardIdx) {
      updatedAnswers[lessonIdx].push([]);
    }

    updatedAnswers[lessonIdx][cardIdx].push(incorrectAnswer);
    setState('answers', updatedAnswers);
    saveToLocalStorage(courseIdx, updatedAnswers);
  };

  const getLessonAnswers = (lessonIndex: number): string[][] => {
    return state.answers[lessonIndex] ?? [];
  };

  const resetLesson = (courseIdx: number, lessonIndex: number): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] = [];
    setState('answers', updatedAnswers);
    saveToLocalStorage(courseIdx, updatedAnswers);
  };

  const getTotalTakenLessons = (): number => {
    return Object.keys(state.answers).length;
  };

  const getTotalQuestionsAnswered = (): number => {
    return Object.values(state.answers).reduce(
      (total, lessonAnswers) => total + lessonAnswers.length,
      0
    );
  };

  const getTotalCorrectAnswers = (): number => {
    return Object.values(state.answers).reduce(
      (total, lessonAnswers) =>
        total +
        lessonAnswers.reduce(
          (sum: number, cardAnswers: string[]) => sum + cardAnswers.filter((a) => a === '').length,
          0
        ),
      0
    );
  };

  const getTotalIncorrectAnswers = (): number => {
    return Object.values(state.answers).reduce(
      (total, lessonAnswers) =>
        total +
        lessonAnswers.reduce(
          (sum: number, cardAnswers: string[]) => sum + cardAnswers.filter((a) => a !== '').length,
          0
        ),
      0
    );
  };

  const getLessonQuestionCount = (lessonIndex: number): number => {
    return getLessonAnswers(lessonIndex).length;
  };

  const getLessonQuestionsAnsweredIncorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
      (total, cardAnswers) =>
        total + (Array.isArray(cardAnswers) ? cardAnswers.filter((a) => a !== '').length : 0),
      0
    );
  };

  const getLessonQuestionsAnsweredCorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
      (total, cardAnswers) =>
        total + (Array.isArray(cardAnswers) ? cardAnswers.filter((a) => a === '').length : 0),
      0
    );
  };

  return {
    lessonIndex: state.lessonIndex,
    updateLessonIdx,
    saveAnswer,
    getLessonAnswers,
    resetLesson,
    getTotalTakenLessons,
    getTotalQuestionsAnswered,
    getTotalCorrectAnswers,
    getTotalIncorrectAnswers,
    getLessonQuestionsAnsweredCorrectly,
    getLessonQuestionCount,
    getLessonQuestionsAnsweredIncorrectly,
  };
};
