import { screen } from "solid-testing-library";
import ActionButton from "./ActionButton";
import { renderTestElement } from "../../../jest.setup";

describe("ActionButton Component", () => {
    test("renders with 'check' text when isCorrect is null", () => {
        renderTestElement(ActionButton, {
            isCorrect: null,
            isInputPresent: true,
            onCheckAnswer: jest.fn(),
            onComplete: jest.fn(),
        });
        expect(screen.getByRole("button").hasAttribute("disabled")).toBe(false);
        expect(screen.getByRole("button").textContent).toBe("check");
    });

    test("renders with 'correct_next' text when isCorrect is true", () => {
        renderTestElement(ActionButton, {
            isCorrect: true,
            isInputPresent: true,
            onCheckAnswer: jest.fn(),
            onComplete: jest.fn(),
        });
        expect(screen.getByRole("button").textContent).toBe("correct_next");
    });

    test("renders with 'incorrect_next' text when isCorrect is false", () => {
        renderTestElement(ActionButton, {
            isCorrect: false,
            isInputPresent: true,
            onCheckAnswer: jest.fn(),
            onComplete: jest.fn(),
        });

        expect(screen.getByRole("button").textContent).toBe("incorrect_next");
    });

    test("button is disabled when isInputPresent is false", () => {
        renderTestElement(ActionButton, {
            isCorrect: null,
            isInputPresent: false,
            onCheckAnswer: jest.fn(),
            onComplete: jest.fn(),
        });
        expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
    });

});
