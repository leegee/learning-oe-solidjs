import { cleanup, screen, fireEvent, waitFor } from "solid-testing-library";
import MultipleChoiceComponent, { type IMultipleChoiceCard, type IMultipleChoiceCardProps } from "./MultipleChoice";
import { renderTestElement } from "../../../../jest.setup";

describe("MultipleChoiceComponent", () => {
    let mockOnCorrect: jest.Mock;
    let mockOnIncorrect: jest.Mock;
    let mockOnComplete: jest.Mock;
    let props: IMultipleChoiceCardProps;

    beforeEach(() => {
        mockOnCorrect = jest.fn();
        mockOnIncorrect = jest.fn();
        mockOnComplete = jest.fn();
        props = {
            card: {
                class: 'multiple-choice',
                qlang: 'target',
                question: "What is Solid.js?",
                answers: ["A framework", "A library", "A tool", "A language"],
                answer: "A library",
            } as IMultipleChoiceCard,
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
        renderTestElement(MultipleChoiceComponent, props);

        expect(screen.getByText("What is Solid.js?")).toBeInTheDocument();
        expect(screen.getByText("A framework")).toBeInTheDocument();
        expect(screen.getByText("A library")).toBeInTheDocument();
        expect(screen.getByText("A tool")).toBeInTheDocument();
        expect(screen.getByText("A language")).toBeInTheDocument();
    });

    test("selecting an option updates the selected state", () => {
        renderTestElement(MultipleChoiceComponent, props);

        const optionButton = screen.getByText("A library");
        fireEvent.click(optionButton);

        expect(optionButton).toHaveClass("selected");
    });

    test("checking the answer triggers the correct callback", async () => {
        renderTestElement(MultipleChoiceComponent, props);

        fireEvent.click(screen.getByText("A library"));

        const checkButton = screen.getByRole("button", { name: "action-button" });
        fireEvent.click(checkButton);

        await waitFor(() => {
            expect(mockOnCorrect).toHaveBeenCalled();
            expect(mockOnIncorrect).not.toHaveBeenCalled();

            expect(screen.getByText("A library")).toBeDisabled();
        });
    });

    test("checking an incorrect answer triggers the incorrect callback", async () => {
        renderTestElement(MultipleChoiceComponent, props);

        fireEvent.click(screen.getByText("A tool"));

        const checkButton = screen.getByRole("button", { name: "action-button" });
        fireEvent.click(checkButton);

        await waitFor(() => {
            expect(mockOnIncorrect).toHaveBeenCalled();
            expect(mockOnCorrect).not.toHaveBeenCalled();

            expect(screen.getByText("A tool")).toBeDisabled();
        });
    });
});
