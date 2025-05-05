import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

type CardWrongAnswers = string[];

type LessonAnswers = CardWrongAnswers[];

interface Answers {
  [lessonIndex: number]: LessonAnswers;
}

export const useLessonStore = (courseIdx: number) => {
  // Use one store for each course.
  const course_storage_key = `answers-store-${courseIdx}`;

  const [state, setState] = makePersisted(
    createStore({
      currentLessonIdx: -1,
      answers: {} as Answers,
    }),
    {
      name: course_storage_key,
      storage: localStorage,
    }
  );

  const setCurrentLessonIdx = (lessonIdx: number) => setState('currentLessonIdx', lessonIdx);

  const getCurrentLessonIdx = () => {
    console.log('state.currentLessonIdx', state.currentLessonIdx)
    return state.currentLessonIdx === -1 ? 0 : state.currentLessonIdx;
  };

  const incrementLessonsIdx = () => setState('currentLessonIdx', getCurrentLessonIdx() + 1);

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
    setState('answers', lessonIndex, []);
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

  const countAnswers = (filterFn: (a: string) => boolean) =>
    Object.values(state.answers).reduce(
      (total, lessonAnswers) =>
        total +
        lessonAnswers.reduce(
          (sum: number, cardAnswers: string[]) => sum + cardAnswers.filter(filterFn).length,
          0
        ),
      0
    );

  const getTotalCorrectAnswers = () => countAnswers((a) => a === '');
  const getTotalIncorrectAnswers = () => countAnswers((a) => a !== '');

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
    getCurrentLessonIdx,
    setCurrentLessonIdx,
    incrementLessonsIdx,
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
