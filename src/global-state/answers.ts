import { createStore } from 'solid-js/store';
import { makePersisted } from '@solid-primitives/storage';

// --- Typings ---

type CardAnswer = {
  wrongAnswers: string[];
  correct: boolean;
};

type LessonAnswers = CardAnswer[];

interface Answers {
  [lessonIndex: number]: LessonAnswers;
}

// --- Hook ---

export const useLessonStore = (courseIdx: number) => {
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


  const _getOrCreateLesson = (lessonIdx: number) => {
    if (!state.answers[lessonIdx]) {
      setState('answers', lessonIdx, []);
    }
    return state.answers[lessonIdx];
  };

  const _getOrCreateCard = (lessonIdx: number, cardIdx: number) => {
    const lesson = _getOrCreateLesson(lessonIdx);
    if (!lesson[cardIdx]) {
      for (let i = lesson.length; i <= cardIdx; i++) {
        setState('answers', lessonIdx, i, { wrongAnswers: [], correct: false });
      }
    }
    return state.answers[lessonIdx][cardIdx];
  };

  // Public API

  const setCurrentLessonIdx = (lessonIdx: number) => setState('currentLessonIdx', lessonIdx);

  const getCurrentLessonIdx = () => (state.currentLessonIdx === -1 ? 0 : state.currentLessonIdx);

  const incrementCurrentLessonIdx = () => setState('currentLessonIdx', getCurrentLessonIdx() + 1);

  const saveAnswer = (lessonIdx: number, cardIdx: number, incorrectAnswer: string = ''): void => {
    _getOrCreateLesson(lessonIdx);
    _getOrCreateCard(lessonIdx, cardIdx);

    setState('answers', lessonIdx, cardIdx, (prev) => {
      if (incorrectAnswer === '') {
        return { ...prev, correct: true };
      } else {
        return { ...prev, wrongAnswers: [...prev.wrongAnswers, incorrectAnswer] };
      }
    });
  };

  const getLessonAnswers = (lessonIndex: number): LessonAnswers => {
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

  const getTotalCorrectAnswers = (): number => {
    return Object.values(state.answers).reduce(
      (total, lessonAnswers) =>
        total + lessonAnswers.filter((card: CardAnswer) => card.correct).length,
      0
    );
  };

  const getTotalIncorrectAnswers = (): number => {
    return Object.values(state.answers).reduce(
      (total, lessonAnswers) =>
        total + lessonAnswers.reduce((sum: number, card: CardAnswer) => sum + card.wrongAnswers.length, 0),
      0
    );
  };

  const getLessonQuestionCount = (lessonIndex: number): number => {
    return getLessonAnswers(lessonIndex).length;
  };

  const getLessonQuestionsAnsweredCorrectly = (lessonIndex: number): number => {
    return getLessonAnswers(lessonIndex).filter((card) => card.correct).length;
  };

  const getLessonQuestionsAnsweredIncorrectly = (lessonIndex: number): number => {
    return getLessonAnswers(lessonIndex).reduce(
      (total, card) => total + card.wrongAnswers.length,
      0
    );
  };

  const isLessonDone = (lessonIndex: number): boolean => {
    const questionCount = getLessonQuestionCount(lessonIndex);
    return (
      questionCount > 0 &&
      getLessonQuestionsAnsweredCorrectly(lessonIndex) === questionCount
    );
  };

  return {
    getCurrentLessonIdx,
    setCurrentLessonIdx,
    incrementCurrentLessonIdx,
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
    isLessonDone,
  };
};
