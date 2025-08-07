import { cleanup, screen, fireEvent, waitFor } from "solid-testing-library";
import { renderTestElement } from "../../../../jest.setup";

import { useCourseStore } from '../../../global-state/course';
import WritingBlocksCardComponent, { type IWritingBlocksCard, type IWritingBlocksCardProps } from "./WritingBlocks";

describe("WritingBlocksCardComponent", () => {
    let mockOnCorrect: jest.Mock;
    let mockOnIncorrect: jest.Mock;
    let mockOnComplete: jest.Mock;
    let props: IWritingBlocksCardProps;

    beforeEach(() => {
        useCourseStore();
        mockOnCorrect = jest.fn();
        mockOnIncorrect = jest.fn();
        mockOnComplete = jest.fn();
        props = {
            card: {
                class: "writing-blocks",
                qlang: "target",
                question: "Rearrange the words to form a correct sentence.",
                answer: "Solid.js is great",
                options: ["Solid.js", "is", "great", "awesome"],
            } as IWritingBlocksCard,
            onCorrect: mockOnCorrect,
            onIncorrect: mockOnIncorrect,
            onComplete: mockOnComplete,
        };
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    test("renders the component and displays the question", () => {
        renderTestElement(WritingBlocksCardComponent, props);

        expect(screen.getByText("Rearrange the words to form a correct sentence.")).toBeInTheDocument();
        expect(screen.getByText("Solid.js")).toBeInTheDocument();
        expect(screen.getByText("is")).toBeInTheDocument();
        expect(screen.getByText("great")).toBeInTheDocument();
        expect(screen.getByText("awesome")).toBeInTheDocument();
    });

    test("selecting a word adds it to the selected words area", () => {
        renderTestElement(WritingBlocksCardComponent, props);

        const wordButton = screen.getByText("Solid.js", { selector: ".option-button" }); // Select from options
        fireEvent.click(wordButton);

        const selectedWord = screen.getByText("Solid.js", { selector: ".selected-word" }); // Ensure it's in selected
        expect(selectedWord).toBeInTheDocument();
    });

    test("removing a word from selected words updates the state", () => {
        renderTestElement(WritingBlocksCardComponent, props);

        const wordButton = screen.getByText("Solid.js", { selector: ".option-button" });
        fireEvent.click(wordButton);

        const selectedWordButton = screen.getByText("Solid.js", { selector: ".selected-word" });
        fireEvent.click(selectedWordButton);

        expect(screen.queryByText("Solid.js", { selector: ".selected-word" })).not.toBeInTheDocument();
    });

    test("checking the correct answer triggers the correct callback", async () => {
        renderTestElement(WritingBlocksCardComponent, props);

        fireEvent.click(screen.getByText("Solid.js", { selector: ".option-button" }));
        fireEvent.click(screen.getByText("is", { selector: ".option-button" }));
        fireEvent.click(screen.getByText("great", { selector: ".option-button" }));

        const checkButton = screen.getByRole("button", { name: "action-button" });
        fireEvent.click(checkButton);

        await waitFor(() => {
            expect(mockOnCorrect).toHaveBeenCalled();
            expect(mockOnIncorrect).not.toHaveBeenCalled();
        });
    });

    test("checking an incorrect answer triggers the incorrect callback", async () => {
        renderTestElement(WritingBlocksCardComponent, props);

        fireEvent.click(screen.getByText("Solid.js", { selector: ".option-button" }));
        fireEvent.click(screen.getByText("awesome", { selector: ".option-button" }));

        const checkButton = screen.getByRole("button", { name: "action-button" });
        fireEvent.click(checkButton);

        await waitFor(() => {
            expect(mockOnIncorrect).toHaveBeenCalled();
            expect(mockOnCorrect).not.toHaveBeenCalled();
        });
    });
});
