import { render, screen, fireEvent } from "@solidjs/testing-library";
import { describe, it, vi, expect } from "vitest";
import ActionButton from "./ActionButton";

// Mock i18n function
vi.mock("../i18n", () => ({
    t: (key: string) => key, // Returns the key itself as a mock translation
}));

describe("ActionButton Component", () => {
    it("renders with 'check' text when isCorrect is null", () => {
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={true}
                onCheckAnswer={vi.fn()}
                onComplete={vi.fn()}
            />
        ));
        expect(screen.getByRole("button").textContent).toBe("check");
    });

    /*
    it("is disabled when isInputPresent is false", () => {
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={false}
                onCheckAnswer={vi.fn()}
                onComplete={vi.fn()}
            />
        ));
        expect(screen.getByRole("button")).toBeDisabled();
    });

    it("calls onCheckAnswer on first click and updates state", async () => {
        const onCheckAnswer = vi.fn();
        render(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={true}
                onCheckAnswer={onCheckAnswer}
                onComplete={vi.fn()}
            />
        ));

        const button = screen.getByRole("button");
        await fireEvent.click(button);

        expect(onCheckAnswer).toHaveBeenCalledTimes(1);
        expect(button.textContent).not.toBe("check"); // Should now show "correct_next" or "incorrect_next"
    });

    it("calls onComplete on second click after checking answer", async () => {
        const onCheckAnswer = vi.fn();
        const onComplete = vi.fn();

        render(() => (
            <ActionButton
                isCorrect={true}
                isInputPresent={true}
                onCheckAnswer={onCheckAnswer}
                onComplete={onComplete}
            />
        ));

        const button = screen.getByRole("button");

        // First click: Calls onCheckAnswer
        await fireEvent.click(button);
        expect(onCheckAnswer).toHaveBeenCalledTimes(1);

        // Second click: Calls onComplete
        await fireEvent.click(button);
        expect(onComplete).toHaveBeenCalledTimes(1);
    });

    it("resets when isCorrect changes to null", async () => {
        const { rerender } = render(() => (
            <ActionButton
                isCorrect={true}
                isInputPresent={true}
                onCheckAnswer={vi.fn()}
                onComplete={vi.fn()}
            />
        ));

        // Update isCorrect to null
        rerender(() => (
            <ActionButton
                isCorrect={null}
                isInputPresent={true}
                onCheckAnswer={vi.fn()}
                onComplete={vi.fn()}
            />
        ));

        expect(screen.getByRole("button").textContent).toBe("check");
    });
    */
});
