export interface Answers {
    [lessonIndex: number]: string[][]; // Structure of answers (lesson index -> card answers)
}

const STORAGE_PREFIX = 'oe_';

export const storageKeys = {
    CURRENT_LESSON_INDEX: (courseId: number) => `${STORAGE_PREFIX}current_lesson_index_${courseId}`,
    ANSWERS: (courseId: number) => `${STORAGE_PREFIX}answers_${courseId}`,
    COURSE_INDEX: `${STORAGE_PREFIX}course`,
};

export let Current_Course_Index: number = getCourseIdx();

export const setCurrentLessonIndex = (lessonIndex: number) => {
    localStorage.setItem(storageKeys.CURRENT_LESSON_INDEX(Current_Course_Index), String(lessonIndex));
};

export const getCurrentLessonIndex = () => {
    return JSON.parse(localStorage.getItem(storageKeys.CURRENT_LESSON_INDEX(Current_Course_Index)) || '0');
};

export const getLessonAnswers = (lessonIndex: number): string[][] => {
    let answers: Answers = {};

    try {
        answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
    } catch (error) {
        console.error("Error parsing lesson answers:", error);
    }

    return answers[lessonIndex] ?? [];
};

export const saveAnswer = (lessonIndex: number, cardIndex: number, incorrectAnswer: string = ""): void => {
    const savedAnswers: Answers = JSON.parse(
        localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index))
        || '{}'
    );
    savedAnswers[lessonIndex] ??= [];

    if (!savedAnswers[lessonIndex][cardIndex]) {
        while (savedAnswers[lessonIndex].length <= cardIndex) {
            savedAnswers[lessonIndex].push([]);
        }
    }

    savedAnswers[lessonIndex][cardIndex].push(incorrectAnswer);

    localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(savedAnswers));
};

export const resetCourse = () => {
    localStorage.removeItem(storageKeys.CURRENT_LESSON_INDEX(Current_Course_Index));
    localStorage.removeItem(storageKeys.ANSWERS(Current_Course_Index));
    Current_Course_Index = -1;
    localStorage.removeItem(storageKeys.COURSE_INDEX);
    // setCurrentLessonIndex(-1);
    // TODO iterate over all courses and remove
};

export const resetLesson = (lessonIndex: number): void => {
    const savedAnswers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
    if (savedAnswers[lessonIndex]) {
        savedAnswers[lessonIndex] = [];
        localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(savedAnswers));
    }
};

export const getTotalTakenLessons = (): number => {
    const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
    return Object.keys(answers).length;
};

export const getTotalQuestionsAnswered = (): number => {
    const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
    return Object.values(answers).reduce(
        (total: number, lessonAnswers: string[][]) =>
            total + (Array.isArray(lessonAnswers) ? lessonAnswers.length : 0),
        0
    );
};

export const getTotalCorrectAnswers = (): number => {
    const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
    return Object.values(answers).reduce(
        (total: number, lessonAnswers: string[][]) =>
            total + (Array.isArray(lessonAnswers) ? lessonAnswers.reduce((sum: number, cardAnswers: string[]) => sum + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0), 0) : 0),
        0
    );
};

export const getTotalIncorrectAnswers = (): number => {
    const answers: Answers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
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

export const getLessonQuestionsAnsweredIncorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
        (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer !== "").length : 0),
        0
    );
};

export const getLessonQuestionsAnsweredCorrectly = (lessonIndex: number): number => {
    const lessonAnswers = getLessonAnswers(lessonIndex);
    return lessonAnswers.reduce(
        (total: number, cardAnswers: string[]) => total + (Array.isArray(cardAnswers) ? cardAnswers.filter(answer => answer === "").length : 0),
        0
    );
};

export function getCourseIdx() {
    const savedIndex = localStorage.getItem(storageKeys.COURSE_INDEX);
    return savedIndex === null ? -1 : isNaN(Number(savedIndex)) ? 0 : parseInt(savedIndex, 10);
};

export const setCourseIdx = (index: number) => {
    Current_Course_Index = Number(index);
    localStorage.setItem(storageKeys.COURSE_INDEX, index.toString());
};
