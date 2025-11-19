import "@jest/globals";
import { useLessonStore } from "./answers";

// Mock the persistence mechanism
jest.mock('@solid-primitives/storage', () => ({
    makePersisted: (signal: any, _options?: any) => signal,
}));

let lessonStore: ReturnType<typeof useLessonStore>;

beforeEach(() => {
    jest.restoreAllMocks();
    lessonStore = useLessonStore(0);
});

describe("useLessonStore", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        lessonStore = useLessonStore(0);
    });

    // describe("initial state", () => {
    //     it("should initialize with currentLessonIdx", () => {
    //         expect(lessonStore.getCurrentLessonIdx()).toBe(-1);
    //     });
    // });

    // describe("lesson index operations", () => {
    //     it("should set current lesson index", () => {
    //         lessonStore.setCurrentLessonIdx(5);
    //         expect(lessonStore.getCurrentLessonIdx()).toBe(5);
    //     });

    //     it("should increment lesson index", () => {
    //         lessonStore.setCurrentLessonIdx(2);
    //         lessonStore.incrementCurrentLessonIdx();
    //         expect(lessonStore.getCurrentLessonIdx()).toBe(3);
    //     });
    // });

    describe("saveAnswer", () => {
        it("should save an incorrect answer to a new lesson/card", () => {
            lessonStore.saveAnswer(1, 0, "wrong-1");
            const answers = lessonStore.getLessonAnswers(1);
            expect(answers).toEqual([
                { wrongAnswers: ["wrong-1"], correct: false }
            ]);
        });

        it("should append multiple incorrect answers", () => {
            lessonStore.saveAnswer(1, 0, "wrong-1");
            lessonStore.saveAnswer(1, 0, "wrong-2");
            const answers = lessonStore.getLessonAnswers(1);
            expect(answers).toEqual([
                { wrongAnswers: ["wrong-1", "wrong-2"], correct: false }
            ]);
        });

        it("should create empty cards if saving to a card index out of order", () => {
            lessonStore.saveAnswer(2, 2, "wrong-late");
            const answers = lessonStore.getLessonAnswers(2);
            expect(answers).toEqual([
                { wrongAnswers: [], correct: false },
                { wrongAnswers: [], correct: false },
                { wrongAnswers: ["wrong-late"], correct: false }
            ]);
        });
    });

    describe("getLessonAnswers", () => {
        it("should return empty array for unknown lesson", () => {
            expect(lessonStore.getLessonAnswers(10)).toEqual([]);
        });

        it("should return answers for existing lesson", () => {
            lessonStore.saveAnswer(0, 0, "a1");
            expect(lessonStore.getLessonAnswers(0)).toEqual([
                { wrongAnswers: ["a1"], correct: false }
            ]);
        });
    });

    describe("resetLesson", () => {
        it("should reset a lesson's answers", () => {
            lessonStore.saveAnswer(0, 0, "wrong");
            lessonStore.resetLesson(0);
            const answers = lessonStore.getLessonAnswers(0);
            expect(answers).toEqual([]);
        });
    });

    describe("total counting functions", () => {
        beforeEach(() => {
            lessonStore.saveAnswer(0, 0, ""); // correct
            lessonStore.saveAnswer(0, 1, "wrong");
            lessonStore.saveAnswer(1, 0, "wrong");
            lessonStore.saveAnswer(1, 1, ""); // correct
        });

        it("should count total taken lessons", () => {
            expect(lessonStore.getTotalTakenLessons()).toBe(2);
        });

        it("should count total questions answered", () => {
            expect(lessonStore.getTotalQuestionsAnswered()).toBe(4);
        });

        it("should count total correct answers", () => {
            expect(lessonStore.getTotalCorrectAnswers()).toBe(2);
        });

        it("should count total incorrect answers", () => {
            expect(lessonStore.getTotalIncorrectAnswers()).toBe(2);
        });
    });

    describe("lesson-specific counting", () => {
        beforeEach(() => {
            lessonStore.saveAnswer(5, 0, "wrong-1");
            lessonStore.saveAnswer(5, 1, "");
            lessonStore.saveAnswer(5, 2, "wrong-2");
        });

        it("should count total questions in a lesson", () => {
            expect(lessonStore.getLessonQuestionCount(5)).toBe(3);
        });

        it("should count correct answers in a lesson", () => {
            expect(lessonStore.getLessonQuestionsAnsweredCorrectly(5)).toBe(1);
        });

        it("should count incorrect answers in a lesson", () => {
            expect(lessonStore.getTotalWrongAttemptsInLesson(5)).toBe(2);
        });
    });
});
