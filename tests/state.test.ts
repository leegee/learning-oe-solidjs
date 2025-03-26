import { describe, it, expect, beforeEach, vi } from "vitest";
import {
    saveAnswer,
} from "../src/Lessons/state";

describe("saveAnswer", () => {
    beforeEach(() => {
        localStorage.clear(); // Ensure a clean slate before each test
    });

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
