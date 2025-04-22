export const STORAGE_PREFIX = 'oe_';

export const storageKeys = {
    CURRENT_LESSON_INDEX: (courseIdx: number) => `${STORAGE_PREFIX}current_lesson_index_${courseIdx}`,
    ANSWERS: (courseIdx: number) => `${STORAGE_PREFIX}answers_${courseIdx}`,
    LESSONS: (courseIdx: number) => `${STORAGE_PREFIX}course_${courseIdx}`,
    COURSE_INDEX: `${STORAGE_PREFIX}course`,
};
