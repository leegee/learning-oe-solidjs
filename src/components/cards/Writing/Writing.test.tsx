import { cleanup, render, screen, fireEvent } from "solid-testing-library";
import WritingCardComponent, { type IWritingCard, type IWritingCardProps } from './Writing';

jest.mock("../../../i18n", () => ({
    t: (key: string) => key,
}));

describe('WritingCardComponent', () => {
    let mockOnCorrect: jest.Mock;
    let mockOnIncorrect: jest.Mock;
    let mockOnComplete: jest.Mock;
    let props: IWritingCardProps;

    beforeEach(() => {
        mockOnCorrect = jest.fn();
        mockOnIncorrect = jest.fn();
        mockOnComplete = jest.fn();
        props = {
            card: {
                qlang: 'default',
                class: 'writing',
                answer: 'correct answer',
                question: 'What is the answer?',
            } as IWritingCard,
            onCorrect: mockOnCorrect,
            onIncorrect: mockOnIncorrect,
            onComplete: mockOnComplete,
        };
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('should display the question', () => {
        render(() => <WritingCardComponent {...props} />);
        expect(screen.getByText('What is the answer?')).toBeInTheDocument();
    });

    it('should call onCorrect when the answer is correct', () => {
        render(() => <WritingCardComponent {...props} />);
        fireEvent.input(
            screen.getByPlaceholderText('type_in ang...'),
            { target: { value: 'correct answer' } }
        );
        fireEvent.click(screen.getByRole('button', { name: /action-button/i }));

        expect(mockOnCorrect).toHaveBeenCalled();
        expect(mockOnIncorrect).not.toHaveBeenCalled();
    });

    it('should call onIncorrect when the answer is incorrect', () => {
        render(() => <WritingCardComponent {...props} />);
        fireEvent.input(screen.getByPlaceholderText('type_in ang...'), { target: { value: 'wrong answer' } });
        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));

        expect(mockOnIncorrect).toHaveBeenCalled();
        expect(mockOnCorrect).not.toHaveBeenCalled();
    });

    it('should call onComplete after next button click', () => {
        render(() => <WritingCardComponent {...props} />);
        fireEvent.input(screen.getByPlaceholderText('type_in ang...'), { target: { value: 'correct answer' } });
        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));

        expect(mockOnCorrect).toHaveBeenCalled();
        expect(mockOnComplete).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));
        expect(mockOnComplete).toHaveBeenCalled();
    });

    it('should focus on input after letter button click', () => {
        render(() => <WritingCardComponent {...props} />);
        fireEvent.click(screen.getByText('æ'));

        expect(screen.getByRole('textbox')).toHaveFocus();
    });
});
