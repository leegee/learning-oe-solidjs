import 'core-js/features/structured-clone';
import 'fake-indexeddb/auto';  // Import this at the top of your test file or in a global setup file
import { connect, getCurrentCourseIndex } from './lessons';
import { AnswerEntry, CourseProgress } from './lessons';

const DEBUG = false;

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
            DEBUG && console.debug('Answer added:', answer);

            // Fetch the stored answer and compare it
            const storedAnswer = await db.answers.get(answer.id);
            DEBUG && console.debug('Stored answer:', storedAnswer);
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

    it('should add course progress entry', async () => {
        const courseProgress: CourseProgress = {
            courseId: 1,
            currentLessonIndex: 0,
        };

        try {
            // Add a course progress entry to the DB
            await db.courseProgress.add(courseProgress);
            DEBUG && console.debug('Course Progress added:', courseProgress);

            // Fetch the stored course progress and compare it
            const storedProgress = await db.courseProgress.get(courseProgress.courseId);
            DEBUG && console.debug('Stored Course Progress:', storedProgress);
            expect(storedProgress).toEqual(courseProgress);
        } catch (error) {
            console.error('Error adding course progress:', error);
            throw error;  // Rethrow to ensure test fails if there's an issue
        }
    });

    it('should retrieve course progress for a given course', async () => {
        const courseId = 1;
        const courseProgress: CourseProgress = {
            courseId,
            currentLessonIndex: 0,
        };

        try {
            // Add a course progress entry to the DB (ensures that there is data to retrieve)
            await db.courseProgress.add(courseProgress);
            DEBUG && console.debug('Course Progress added:', courseProgress);

            // Fetch the stored course progress
            const retrievedCourseProgress = await db.courseProgress.get(courseId);
            DEBUG && console.debug('Retrieved Course Progress:', retrievedCourseProgress);

            // Ensure the progress was successfully added
            expect(retrievedCourseProgress).not.toBeNull();
            expect(retrievedCourseProgress?.courseId).toBe(courseId);
            expect(retrievedCourseProgress?.currentLessonIndex).toBe(courseProgress.currentLessonIndex);
        } catch (error) {
            console.error('Error retrieving course progress:', error);
            throw error;
        }
    });

});
