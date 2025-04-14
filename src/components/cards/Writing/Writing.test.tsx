import { cleanup, screen, fireEvent, waitFor } from "solid-testing-library";
import { renderTestElement } from '../../../../jest.setup.tsx';

import WritingCardComponent, { type IWritingCard, type IWritingCardProps } from './Writing';

jest.mock("../../../lib/i18n", () => ({
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
        renderTestElement(WritingCardComponent, props);
        expect(screen.getByText('What is the answer?')).toBeInTheDocument();
    });

    it('should call onCorrect when the answer is correct', () => {
        renderTestElement(WritingCardComponent, props);
        fireEvent.input(
            screen.getByPlaceholderText('type_in ang...'),
            { target: { value: 'correct answer' } }
        );
        fireEvent.click(screen.getByRole('button', { name: /action-button/i }));

        expect(mockOnCorrect).toHaveBeenCalled();
        expect(mockOnIncorrect).not.toHaveBeenCalled();
    });

    it('should call onIncorrect when the answer is incorrect', () => {
        renderTestElement(WritingCardComponent, props);
        fireEvent.input(screen.getByPlaceholderText('type_in ang...'), { target: { value: 'wrong answer' } });
        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));

        expect(mockOnIncorrect).toHaveBeenCalled();
        expect(mockOnCorrect).not.toHaveBeenCalled();
    });

    it('should call onComplete after next button click', () => {
        renderTestElement(WritingCardComponent, props);
        fireEvent.input(screen.getByPlaceholderText('type_in ang...'), { target: { value: 'correct answer' } });
        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));

        expect(mockOnCorrect).toHaveBeenCalled();
        expect(mockOnComplete).not.toHaveBeenCalled();

        fireEvent.click(screen.getByRole('button', { name: 'action-button' }));
        expect(mockOnComplete).toHaveBeenCalled();
    });

    it('should focus on input after letter button click', async () => {
        renderTestElement(WritingCardComponent, props);
        fireEvent.click(screen.getByText('æ'));
        // Wait for the microtask:
        await waitFor(() => expect(screen.getByRole('textbox')).toHaveFocus());
    });
});
