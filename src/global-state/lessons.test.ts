import "@jest/globals";
import { useCourseStore, type ICourseStore } from './course';
import { useLessonStore } from "./lessons";
import { storageKeys } from "./keys";
import { createResource } from "solid-js";

let lessonStore: ReturnType<typeof useLessonStore>;
let courseStore: ICourseStore;

describe("state", () => {
    beforeEach(async () => {
        jest.restoreAllMocks();
        lessonStore = useLessonStore(0);
        const [getCourseStore] = createResource<ICourseStore, true>(useCourseStore);
        courseStore = await getCourseStore()!;
        localStorage.clear();
        courseStore.setCourseIdx(1);
    });

    describe("saveAnswer", () => {
        it("should save an incorrect answer for a lesson card", () => {
            lessonStore!.saveAnswer(1, 1, 0, "incorrect1");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore!.getCourseIdx())) || "{}");
            expect(storedAnswers).toEqual({ 1: [["incorrect1"]] });
        });

        it("should append multiple incorrect answers to the same card", () => {
            lessonStore!.saveAnswer(1, 1, 0, "wrong1");
            lessonStore!.saveAnswer(1, 1, 0, "wrong2");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx())) || "{}");
            expect(storedAnswers).toEqual({ 1: [["wrong1", "wrong2"]] });
        });

        it("should initialize arrays when saving to a new lesson index", () => {
            lessonStore!.saveAnswer(1, 2, 3, "mistake");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx())) || "{}");
            expect(storedAnswers).toEqual({ 2: [[], [], [], ["mistake"]] });
        });

        it("should not break when saving an empty string as an answer", () => {
            lessonStore!.saveAnswer(1, 1, 0, "");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx())) || "{}");
            expect(storedAnswers).toEqual({ 1: [[""]] });
        });

        it("should preserve existing data when adding new answers", () => {
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify({ 1: [["existing"]] }));

            lessonStore!.saveAnswer(1, 1, 0, "new");

            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx())) || "{}");
            expect(storedAnswers).toEqual({ 1: [["existing", "new"]] });
        });
    });

    describe("getLessonAnswers", () => {
        it("should return an empty array if no answers exist for the lesson", () => {
            expect(lessonStore!.getLessonAnswers(2)).toEqual([]);
        });

        it("should return the stored answers for a given lesson index", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(
                storageKeys.ANSWERS(courseStore.getCourseIdx()),
                JSON.stringify(mockData)
            );
            expect(lessonStore!.getLessonAnswers(2)).toEqual(mockData[2]);
        });

        it("should return an empty array if localStorage contains invalid JSON", () => {
            const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue('mock invalid json');
            expect(lessonStore!.getLessonAnswers(2)).toEqual([]);
            consoleErrorMock.mockRestore();
        });

        it("should return an empty array if localStorage has no 'oe_answers' key", () => {
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue(null);
            expect(lessonStore!.getLessonAnswers(2)).toEqual([]);
        });
    });

    describe("resetLesson", () => {
        it("should remove answers for the given lesson index", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));

            lessonStore!.resetLesson(courseStore.getCourseIdx(), 2);

            const savedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx())) || '{}');
            expect(savedAnswers[2]).toEqual([]);

            expect(lessonStore!.getLessonAnswers(2)).toEqual([]); // Check if the data is removed
        });

        it("should do nothing if the lesson index doesn't exist", () => {
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue("{}");
            const setItemSpy = jest.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => { });

            lessonStore!.resetLesson(courseStore.getCourseIdx(), 5); // Non-existent lesson

            expect(setItemSpy).not.toHaveBeenCalled();
        });
    });

    describe("getTotalLessonsCount", () => {
        it("should return a count of all lessons taken", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));

            const count = lessonStore!.getTotalTakenLessons();
            expect(count).toEqual(3);
        });
    });

    describe("getTotalQuestionsAnswered", () => {
        it("should return a count of all questions answered", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getTotalQuestionsAnswered();
            expect(count).toEqual(5);
        });
    });

    describe("getTotalCorrectAnswers", () => {
        it("should return a count of all questions answered correctly", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"]],
                3: [["extra"]],
                4: [[""]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getTotalCorrectAnswers();
            expect(count).toEqual(3);
        });
    });

    describe("getTotalIncorrectAnswers", () => {
        it("should return a count of all questions answered incorrectly", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getTotalIncorrectAnswers();
            expect(count).toEqual(3);
        });
    });

    describe("getLessonQuestionCount", () => {
        it("should return a count of all questions answered in a specific lesson", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getLessonQuestionCount(2);
            expect(count).toEqual(2);
        });
    });

    describe("countLessonAnswersIncorrect", () => {
        it("should return a count of all questions answered incorrectly in a specific lesson", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"], ["wrong3"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getLessonQuestionsAnsweredIncorrectly(2);
            expect(count).toEqual(2);
        });
    });

    describe("countLessonAnswersCorrect", () => {
        it("should return a count of all questions answered correctly in a specific lesson", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"], ["wrong3"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            const count = lessonStore!.getLessonQuestionsAnsweredCorrectly(2);
            expect(count).toEqual(1);
        });
    });

    describe("resetAll", () => {
        it("should reset all lessons", () => {
            const mockData = {
                1: [["answer1"], [""]],
                2: [[""], ["wrong2"], ["wrong3"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(courseStore.getCourseIdx()), JSON.stringify(mockData));
            courseStore.reset();
            expect(localStorage.getItem(storageKeys.ANSWERS(courseStore.getCourseIdx()))).toBe(null);
        });
    });

    describe("Course Index", () => {
        beforeEach(() => {
            localStorage.clear();
            jest.restoreAllMocks();
        });

        describe("courseStore.getCourseIdx()", () => {
            it("should return -1 if no course index is saved in localStorage", () => {
                expect(courseStore.getCourseIdx()).toBe(-1);
            });

            it("should return the saved course index from localStorage", () => {
                localStorage.setItem(storageKeys.COURSE_INDEX, "3");
                expect(courseStore.getCourseIdx()).toBe(3);
            });

            it("should return 0 if saved course index is not a valid number", () => {
                localStorage.setItem(storageKeys.COURSE_INDEX, "invalid");
                expect(courseStore.getCourseIdx()).toBe(0);
            });
        });

        describe("courseStore.setCourseIdx", () => {
            it("should save the course index in localStorage", () => {
                courseStore.setCourseIdx(5);
                expect(localStorage.getItem(storageKeys.COURSE_INDEX)).toBe("5");
            });

            it("should update the global courseStore.getCourseIdx() value", () => {
                courseStore.setCourseIdx(7);
                expect(courseStore.getCourseIdx()).toBe(7);
            });
        });


    });

});
