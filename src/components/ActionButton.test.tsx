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
});
