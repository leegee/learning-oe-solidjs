import {
    getLessonAnswers,
    getTotalTakenLessons,
    getTotalQuestionsAnswered,
    resetLesson,
    saveAnswer,
    getTotalCorrectAnswers,
    getTotalIncorrectAnswers,
    getLessonQuestionCount,
    getLessonQuestionsAnsweredIncorrect,
    getLessonQuestionsAnsweredCcorrect,
    resetAll,
} from "./lessons-state";

describe("state", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    describe("saveAnswer", () => {
        it("should save an incorrect answer for a lesson card", () => {
            saveAnswer(1, 0, "incorrect1");
            const storedAnswers = JSON.parse(localStorage.getItem("oe_answers") || "{}");
            expect(storedAnswers).toEqual({ 1: [["incorrect1"]] });
        });

        it("should append multiple incorrect answers to the same card", () => {
            saveAnswer(1, 0, "wrong1");
            saveAnswer(1, 0, "wrong2");
            const storedAnswers = JSON.parse(localStorage.getItem("oe_answers") || "{}");
            expect(storedAnswers).toEqual({ 1: [["wrong1", "wrong2"]] });
        });

        it("should initialize arrays when saving to a new lesson index", () => {
            saveAnswer(2, 3, "mistake");
            const storedAnswers = JSON.parse(localStorage.getItem("oe_answers") || "{}");
            expect(storedAnswers).toEqual({ 2: [[], [], [], ["mistake"]] });
        });

        it("should not break when saving an empty string as an answer", () => {
            saveAnswer(1, 0, "");
            const storedAnswers = JSON.parse(localStorage.getItem("oe_answers") || "{}");
            expect(storedAnswers).toEqual({ 1: [[""]] });
        });

        it("should preserve existing data when adding new answers", () => {
            localStorage.setItem("oe_answers", JSON.stringify({ 1: [["existing"]] }));

            saveAnswer(1, 0, "new");

            const storedAnswers = JSON.parse(localStorage.getItem("oe_answers") || "{}");
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
                'oe_answers',
                JSON.stringify(mockData)
            );
            expect(getLessonAnswers(2)).toEqual(mockData[2]);
        });

        it("should return an empty array if localStorage contains invalid JSON", () => {
            jest.spyOn(global.Storage.prototype, "getItem").mockReturnValue('mock invalid json');
            expect(getLessonAnswers(2)).toEqual([]);
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));

            resetLesson(2);

            const savedAnswers = JSON.parse(localStorage.getItem('oe_answers') || '');
            expect(savedAnswers[2]).toEqual([]);

            expect(getLessonAnswers(2)).toEqual([]); // Check if the data i
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));

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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
            const count = getLessonQuestionsAnsweredIncorrect(2);
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
            const count = getLessonQuestionsAnsweredCcorrect(2);
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
            localStorage.setItem('oe_answers', JSON.stringify(mockData));
            resetAll();
            expect(localStorage.getItem('oe_answers')).toBe(null);
        });
    });
});
