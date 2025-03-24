import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    saveAnswer,
    getTotalLessons,
    resetLesson,
    getTotalQuestionsAnswered,
    getTotalCorrectAnswers,
    getTotalIncorrectAnswers,
    countLessonAnswersCorrect,
    countLessonAnswersIncorrect,
    getLessonQuestionCount,
} from "../src/Lessons/state";

// Mock localStorage for testing
beforeEach(() => {
    vi.spyOn(global.localStorage.__proto__, "setItem").mockImplementation(vi.fn());
    vi.spyOn(global.localStorage.__proto__, "getItem").mockImplementation(vi.fn());
    vi.spyOn(global.localStorage.__proto__, "removeItem").mockImplementation(vi.fn());
});

describe("Lesson State Management", () => {
    it("should start with zero lessons", () => {
        expect(getTotalLessons()).toBe(0);
    });

    it("should save an incorrect answer and retrieve it correctly", () => {
        saveAnswer(0, 0, "wrong1");
        saveAnswer(0, 1, "wrong2");

        expect(getTotalLessons()).toBe(1);
        expect(getLessonQuestionCount(0)).toBe(2);
        expect(countLessonAnswersIncorrect(0)).toBe(2);
        expect(countLessonAnswersCorrect(0)).toBe(0);
    });

    it("should track correct and incorrect answers separately", () => {
        saveAnswer(1, 0, ""); // Correct answer
        saveAnswer(1, 1, "wrong1"); // Incorrect answer

        expect(countLessonAnswersCorrect(1)).toBe(1);
        expect(countLessonAnswersIncorrect(1)).toBe(1);
    });

    it("should reset lesson answers", () => {
        saveAnswer(2, 0, "wrong1");
        saveAnswer(2, 1, "wrong2");

        expect(getLessonQuestionCount(2)).toBe(2);

        resetLesson(2);

        expect(getLessonQuestionCount(2)).toBe(0);
        expect(countLessonAnswersIncorrect(2)).toBe(0);
    });

    it("should calculate total questions answered correctly", () => {
        resetLesson(0);
        expect(getTotalQuestionsAnswered()).toBe(2);
    });

    it.skip("should count total correct answers", () => {
        resetLesson(0);
        resetLesson(1);
        resetLesson(2);
        resetLesson(3);
        saveAnswer(1, 0, ""); // Correct
        saveAnswer(2, 1, "wrong1"); // Incorrect
        saveAnswer(3, 0, ""); // Correct

        expect(getTotalCorrectAnswers()).toBe(2);
    });

    it.skip("should count total incorrect answers", () => {
        resetLesson(0);
        resetLesson(1);
        resetLesson(2);
        resetLesson(3);
        saveAnswer(1, 0, ""); // Correct
        saveAnswer(2, 1, "wrong1"); // Incorrect
        saveAnswer(3, 0, ""); // Correct

        expect(getTotalIncorrectAnswers()).toBe(1);
    });
});
