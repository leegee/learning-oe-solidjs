import 'core-js/features/structured-clone';
import 'fake-indexeddb/auto';
import { connect, getCurrentCourseIndex } from './lessons';
import { AnswerEntry, CourseProgress } from './lessons';

describe('AppDB Tests', () => {
    let db: any;

    beforeEach(async () => {
        try {
            // Connect to the test database
            db = connect('TestDB');
            await getCurrentCourseIndex();
        } catch (error) {
            console.error('Error during beforeEach setup:', error);
        }
    });

    afterEach(async () => {
        try {
            await db.close();
            db.delete({ disableAutoOpen: true });
        } catch (error) {
            console.error('Error during afterEach cleanup:', error);
        }
    });

    // Test for adding and retrieving an AnswerEntry
    it('should add and retrieve an answer entry', async () => {
        const answer: AnswerEntry = {
            id: '1_0_0',
            courseId: 1,
            lessonIndex: 0,
            cardIndex: 0,
            answers: ['Answer 1'],
        };

        try {
            await db.answers.add(answer);
            const storedAnswer = await db.answers.get(answer.id);
            expect(storedAnswer).toEqual(answer);
        } catch (error) {
            console.error('Error adding/retrieving answer:', error);
            throw error;
        }
    });

    // Test for adding, updating, and retrieving CourseProgress
    it('should add, update, and retrieve course progress', async () => {
        const courseId = 1;
        const initialProgress: CourseProgress = { courseId, currentLessonIndex: 0 };

        try {
            // Add course progress
            await db.courseProgress.add(initialProgress);
            let storedProgress = await db.courseProgress.get(courseId);
            expect(storedProgress?.currentLessonIndex).toBe(initialProgress.currentLessonIndex);

            // Update course progress
            const updatedProgress: CourseProgress = { courseId, currentLessonIndex: 1 };
            await db.courseProgress.put(updatedProgress);
            storedProgress = await db.courseProgress.get(courseId);
            expect(storedProgress?.currentLessonIndex).toBe(updatedProgress.currentLessonIndex);
        } catch (error) {
            console.error('Error adding/updating/retrieving course progress:', error);
            throw error;
        }
    });

    // Test for deleting an AnswerEntry
    it('should delete an answer entry', async () => {
        const answer: AnswerEntry = {
            id: '1_0_0',
            courseId: 1,
            lessonIndex: 0,
            cardIndex: 0,
            answers: ['Answer 1'],
        };

        try {
            await db.answers.add(answer);
            await db.answers.delete(answer.id);
            const storedAnswer = await db.answers.get(answer.id);
            expect(storedAnswer).toBeUndefined();
        } catch (error) {
            console.error('Error deleting answer:', error);
            throw error;
        }
    });

    // Test for deleting CourseProgress
    it('should delete course progress', async () => {
        const courseId = 1;
        const courseProgress: CourseProgress = { courseId, currentLessonIndex: 0 };

        try {
            await db.courseProgress.add(courseProgress);
            await db.courseProgress.delete(courseId);
            const storedProgress = await db.courseProgress.get(courseId);
            expect(storedProgress).toBeUndefined();
        } catch (error) {
            console.error('Error deleting course progress:', error);
            throw error;
        }
    });

    // Test for retrieving course progress by courseId
    it('should retrieve course progress for a given course', async () => {
        const courseId = 1;
        const courseProgress: CourseProgress = { courseId, currentLessonIndex: 0 };

        try {
            await db.courseProgress.add(courseProgress);
            const retrievedProgress = await db.courseProgress.get(courseId);
            expect(retrievedProgress?.courseId).toBe(courseId);
            expect(retrievedProgress?.currentLessonIndex).toBe(courseProgress.currentLessonIndex);
        } catch (error) {
            console.error('Error retrieving course progress:', error);
            throw error;
        }
    });
});
