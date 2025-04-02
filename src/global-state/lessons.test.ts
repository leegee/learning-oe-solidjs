import "@jest/globals";

import {
    getLessonAnswers,
    getTotalTakenLessons,
    getTotalQuestionsAnswered,
    resetLesson,
    saveAnswer,
    getTotalCorrectAnswers,
    getTotalIncorrectAnswers,
    getLessonQuestionCount,
    getLessonQuestionsAnsweredIncorrectly,
    getLessonQuestionsAnsweredCorrectly,
    resetCourse,
    setCourseIndex,
    storageKeys,
    Current_Course_Index,
    getCourseIndex,
} from "./lessons";

describe("state", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
        setCourseIndex(1);
    });

    describe("saveAnswer", () => {
        it("should save an incorrect answer for a lesson card", () => {
            saveAnswer(1, 0, "incorrect1");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
            expect(storedAnswers).toEqual({ 1: [["incorrect1"]] });
        });

        it("should append multiple incorrect answers to the same card", () => {
            saveAnswer(1, 0, "wrong1");
            saveAnswer(1, 0, "wrong2");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
            expect(storedAnswers).toEqual({ 1: [["wrong1", "wrong2"]] });
        });

        it("should initialize arrays when saving to a new lesson index", () => {
            saveAnswer(2, 3, "mistake");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
            expect(storedAnswers).toEqual({ 2: [[], [], [], ["mistake"]] });
        });

        it("should not break when saving an empty string as an answer", () => {
            saveAnswer(1, 0, "");
            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
            expect(storedAnswers).toEqual({ 1: [[""]] });
        });

        it("should preserve existing data when adding new answers", () => {
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify({ 1: [["existing"]] }));

            saveAnswer(1, 0, "new");

            const storedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || "{}");
            expect(storedAnswers).toEqual({ 1: [["existing", "new"]] });
        });
    });

    describe("getLessonAnswers", () => {
        it("should return an empty array if no answers exist for the lesson", () => {
            expect(getLessonAnswers(2)).toEqual([]);
        });

        it("should return the stored answers for a given lesson index", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(
                storageKeys.ANSWERS(Current_Course_Index),
                JSON.stringify(mockData)
            );
            expect(getLessonAnswers(2)).toEqual(mockData[2]);
        });

        it("should return an empty array if localStorage contains invalid JSON", () => {
            const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => { });
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue('mock invalid json');
            expect(getLessonAnswers(2)).toEqual([]);
            consoleErrorMock.mockRestore();
        });

        it("should return an empty array if localStorage has no 'oe_answers' key", () => {
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue(null);
            expect(getLessonAnswers(2)).toEqual([]);
        });
    });

    describe("resetLesson", () => {
        it("should remove answers for the given lesson index", () => {
            const mockData = {
                1: [["answer1"], ["answer2"]],
                2: [["wrong1"], ["wrong2"]],
                3: [["extra"]],
            };
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));

            resetLesson(2);

            const savedAnswers = JSON.parse(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index)) || '{}');
            expect(savedAnswers[2]).toEqual([]);

            expect(getLessonAnswers(2)).toEqual([]); // Check if the data is removed
        });

        it("should do nothing if the lesson index doesn't exist", () => {
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue("{}");
            const setItemSpy = jest.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => { });

            resetLesson(5); // Non-existent lesson

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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));

            const count = getTotalTakenLessons();
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getTotalQuestionsAnswered();
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getTotalCorrectAnswers();
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getTotalIncorrectAnswers();
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getLessonQuestionCount(2);
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getLessonQuestionsAnsweredIncorrectly(2);
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            const count = getLessonQuestionsAnsweredCorrectly(2);
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
            localStorage.setItem(storageKeys.ANSWERS(Current_Course_Index), JSON.stringify(mockData));
            resetCourse();
            expect(localStorage.getItem(storageKeys.ANSWERS(Current_Course_Index))).toBe(null);
        });
    });

    describe("Course Index", () => {
        beforeEach(() => {
            localStorage.clear();
            jest.restoreAllMocks();
        });

        describe("getCourseIndex", () => {
            it("should return 0 if no course index is saved in localStorage", () => {
                expect(getCourseIndex()).toBe(0);
            });

            it("should return the saved course index from localStorage", () => {
                localStorage.setItem(storageKeys.COURSE_INDEX, "3");
                expect(getCourseIndex()).toBe(3);
            });

            it("should return 0 if saved course index is not a valid number", () => {
                localStorage.setItem(storageKeys.COURSE_INDEX, "invalid");
                expect(getCourseIndex()).toBe(0);
            });
        });

        describe("setCourseIndex", () => {
            it("should save the course index in localStorage", () => {
                setCourseIndex(5);
                expect(localStorage.getItem(storageKeys.COURSE_INDEX)).toBe("5");
            });

            it("should update the global Current_Course_Index value", () => {
                setCourseIndex(7);
                expect(Current_Course_Index).toBe(7);
            });
        });
    });

});
