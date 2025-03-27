import { render, screen } from "solid-testing-library";
import { describe, test, expect, jest } from "@jest/globals";
import ActionButton from "./ActionButton";

jest.mock("../i18n", () => ({
    t: (key: string) => key,
}));

describe("ActionButton Component", () => {
    test("renders with 'check' text when isCorrect is null", () => {
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={true}
                onCheckAnswer={jest.fn()}
                onComplete={jest.fn()}
            />
        ));
        expect(screen.getByRole("button").textContent).toBe("check");
    });

    test("renders with 'correct_next' text when isCorrect is true", () => {
        render(() => (
            <ActionButton
                isCorrect={true}
                isInputPresent={true}
                onCheckAnswer={jest.fn()}
                onComplete={jest.fn()}
            />
        ));
        expect(screen.getByRole("button").textContent).toBe("correct_next");
    });

    test("renders with 'incorrect_next' text when isCorrect is false", () => {
        render(() => (
            <ActionButton
                isCorrect={false}
                isInputPresent={true}
                onCheckAnswer={jest.fn()}
                onComplete={jest.fn()}
            />
        ));
        expect(screen.getByRole("button").textContent).toBe("incorrect_next");
    });

    test("button is disabled when isInputPresent is false", () => {
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={false}
                onCheckAnswer={jest.fn()}
                onComplete={jest.fn()}
            />
        ));
        expect(screen.getByRole("button").hasAttribute("disabled")).toBe(true);
    });

    test("button is enabled when isInputPresent is true", () => {
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={true}
                onCheckAnswer={jest.fn()}
                onComplete={jest.fn()}
            />
        ));
        expect(screen.getByRole("button").hasAttribute("disabled")).toBe(false);
    });
});
