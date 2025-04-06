import 'core-js/features/structured-clone';
import 'fake-indexeddb/auto';  // Import this at the top of your test file or in a global setup file
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

    it('should add an answer entry', async () => {
        const answer: AnswerEntry = {
            id: '1_0_0',
            courseId: 1,
            lessonIndex: 0,
            cardIndex: 0,
            answers: ['Answer 1'],
        };

        try {
            // Add an answer entry to the DB
            await db.answers.add(answer);
            console.log('Answer added:', answer);

            // Fetch the stored answer and compare it
            const storedAnswer = await db.answers.get(answer.id);
            console.log('Stored answer:', storedAnswer);
            expect(storedAnswer).toEqual(answer);
        } catch (error) {
            console.error('Error adding answer:', error);
            throw error;  // Rethrow to ensure test fails if there's an issue
        }
    });

    it('should retrieve the current course index', async () => {
        try {
            const courseIndex = await getCurrentCourseIndex();
            expect(courseIndex).toBe(1); // Assuming 1 is the expected result
        } catch (error) {
            console.error('Error retrieving course index:', error);
            throw error;
        }
    });

});
