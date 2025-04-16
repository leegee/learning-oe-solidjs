import { createStore } from 'solid-js/store';
import { courseStore } from "./course";
import { storageKeys } from "./keys";

// Store state shape
interface Answers {
  [lessonIndex: number]: string[][]; // Structure of answers (lesson index -> card answers)
}

let Current_Course_Index: number = courseStore.getCourseIdx();

const loadFromLocalStorage = (): Answers => {
  try {
    const savedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
    return savedAnswers;
  } catch (error) {
    console.error("Error loading from localStorage:", error);
    return {};
  }
};

const saveToLocalStorage = (answers: Answers): void => {
  try {
    localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(answers));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

// Hook to manage lesson store
export const useLessonStore = () => {
  // Initialize the store with the lesson index from localStorage
  const [state, setState] = createStore({
    lessonIndex: getLessonIdx(), // Initializes lessonIndex from localStorage
    answers: loadFromLocalStorage(), // Load answers from localStorage
  });

  // Update lessonIndex in state and localStorage
  const updateLessonIdx = (newLessonIndex: number) => {
    setState('lessonIndex', newLessonIndex);  // Update state
    setLessonidx(newLessonIndex); // Update localStorage as well
  };

  // Save an answer to the store and localStorage
  const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer: string = ""): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] ??= [];

    if (!updatedAnswers[lessonIndex][cardIndex]) {
      while (updatedAnswers[lessonIndex].length <= cardIndex) {
        updatedAnswers[lessonIndex].push([]);
      }
    }

    updatedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);
    setState('answers', updatedAnswers); // Update store state
    saveToLocalStorage(updatedAnswers); // Save to localStorage
  };

  // Get answers for a specific lesson
  const getLessonAnswers = (lessonIndex: number): string[][] => {
    return state.answers[lessonIndex] ?? [];
  };

  // Reset the answers for a specific lesson
  const resetLesson = (lessonIndex: number): void => {
    const updatedAnswers = { ...state.answers };
    updatedAnswers[lessonIndex] = [];
    setState('answers', updatedAnswers); // Update state
    saveToLocalStorage(updatedAnswers); // Save to localStorage
  };

  // Other helper functions
  const getTotalTakenLessons = (): number => {
    return Object.keys(state.answers).length;
  };

  const getTotalQuestionsAnswered = (): number => {
    return Object.values(state.answers).reduce((total: number, lessonAnswers: string[][]) => total + lessonAnswers.length, 0);
  };

  const getTotalCorrectAnswers = (): number => {
    return Object.values(state.answers).reduce((total: number, lessonAnswers: string[][]) =>
      total + lessonAnswers.reduce((sum: number, cardAnswers: string[]) =>
        sum + cardAnswers.filter(answer => answer === "").length, 0), 0);
  };

  const getTotalIncorrectAnswers = (): number => {
    return Object.values(state.answers).reduce((total: number, lessonAnswers: string[][]) =>
      total + lessonAnswers.reduce((sum: number, cardAnswers: string[]) =>
        sum + cardAnswers.filter(answer => answer !== "").length, 0), 0);
  };

  const getLessonQuestionCount = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.length;
  };

  const getLessonQuestionsAnsweredIncorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
      (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
      0
    );
  };

  const getLessonQuestionsAnsweredCorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
      (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
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

const getLessonIdx = () => {
  return JSON.parse(localStorage.getItem(storageKeys.CURRENT_LESSON_INDEX(Current_Course_Index)) || '0');
};

const setLessonidx = (lessonIndex: number) => {
  localStorage.setItem(storageKeys.CURRENT_LESSON_INDEX(Current_Course_Index), String(lessonIndex));
};
