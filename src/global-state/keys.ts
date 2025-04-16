export const STORAGE_PREFIX = 'oe_';

export const storageKeys = {
    CURRENT_LESSON_INDEX: (courseId: number) => `${STORAGE_PREFIX}current_lesson_index_${courseId}`,
    ANSWERS: (courseId: number) => `${STORAGE_PREFIX}answers_${courseId}`,
    COURSE_INDEX: `${STORAGE_PREFIX}course`,
};
