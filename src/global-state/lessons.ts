import { createStore } from 'solid-js/store';
import { useCourseStore, type ICourseStore } from './course';
import { storageKeys } from './keys';
import { createEffect, createResource, createSignal } from 'solid-js';

interface Answers {
  [lessonIndex: number]: string[][]; // (lesson index -> card answers)
}

const [courseStore] = createResource<ICourseStore>(useCourseStore);
const [currentCourseIndex, setCurrentCourseIndex] = createSignal<number>(0);

createEffect(() => {
  const store = courseStore();
  if (store) {
    const idx = store.getCourseIdx();
    setCurrentCourseIndex(idx);
    console.trace('CourseStore loaded', idx);
  }
});

const loadFromLocalStorage = (courseIndex: number): Answers => {
  try {
    const savedAnswers = JSON.parse(
      localStorage.getItem(storageKeys.ANSWERS(courseIndex)) || '{}'
    );
    return savedAnswers;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

const saveToLocalStorage = (courseIndex: number, answers: Answers): void => {
  try {
    localStorage.setItem(storageKeys.ANSWERS(courseIndex), JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getLessonIdx = (courseIndex: number): number => {
  return JSON.parse(localStorage.getItem(storageKeys.CURRENT_LESSON_INDEX(courseIndex)) || '0');
};

const setLessonIdx = (courseIndex: number, lessonIndex: number): void => {
  localStorage.setItem(storageKeys.CURRENT_LESSON_INDEX(courseIndex), String(lessonIndex));
};

export const useLessonStore = () => {
  const courseIndex = currentCourseIndex();

  const [state, setState] = createStore({
    lessonIndex: getLessonIdx(courseIndex),
    answers: loadFromLocalStorage(courseIndex),
  });

  const updateLessonIdx = (newLessonIndex: number) => {
    setState('lessonIndex', newLessonIndex);
    setLessonIdx(courseIndex, newLessonIndex);
  };

  const saveAnswer = (
    lessonIndex: number,
    cardIndex: number,
    incorrectAnswer: string = ''
  ): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] ??= [];

    while (updatedAnswers[lessonIndex].length <= cardIndex) {
      updatedAnswers[lessonIndex].push([]);
    }

    updatedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);
    setState('answers', updatedAnswers);
    saveToLocalStorage(courseIndex, updatedAnswers);
  };

  const getLessonAnswers = (lessonIndex: number): string[][] => {
    return state.answers[lessonIndex] ?? [];
  };

  const resetLesson = (lessonIndex: number): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] = [];
    setState('answers', updatedAnswers);
    saveToLocalStorage(courseIndex, updatedAnswers);
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
