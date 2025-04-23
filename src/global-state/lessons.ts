import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

interface Answers {
  [lessonIndex: number]: string[][]; // (lesson index -> card answers)
}

export const useLessonStore = (courseIdx: number) => {
  const storageName = `lesson-store-${courseIdx}`;

  const [state, setState] = makePersisted(
    createStore({
      lessonIndex: 0,
      answers: {} as Answers,
    }),
    {
      name: storageName,
      storage: localStorage,
    }
  );

  const updateLessonIdx = (newLessonIndex: number) => {
    setState('lessonIndex', newLessonIndex);
  };

  const saveAnswer = (
    lessonIdx: number,
    cardIdx: number,
    incorrectAnswer: string = ''
  ): void => {
    if (!state.answers[lessonIdx]) {
      setState('answers', lessonIdx, []);
    }

    const cardExists = state.answers[lessonIdx]?.[cardIdx];
    if (!cardExists) {
      // Add empty arrays until the desired index exists
      for (let i = state.answers[lessonIdx].length; i <= cardIdx; i++) {
        setState('answers', lessonIdx, i, []);
      }
    }

    const existingAnswers = state.answers[lessonIdx][cardIdx] ?? [];
    setState('answers', lessonIdx, cardIdx, [...existingAnswers, incorrectAnswer]);
  };


  const getLessonAnswers = (lessonIndex: number): string[][] => {
    return state.answers[lessonIndex] ?? [];
  };

  const resetLesson = (lessonIndex: number): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] = [];
    setState('answers', updatedAnswers);
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
          (sum: number, cardAnswers: []) => sum + cardAnswers.filter((a) => a === '').length,
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
