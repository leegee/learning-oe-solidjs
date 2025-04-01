import { render, screen, fireEvent, waitFor } from 'solid-testing-library';
import BlanksCardComponent, { type IBlanksCard, type IBlanksCardProps } from './Blanks.tsx';
import { shuffleArray } from '../../../lib/shuffle-array.ts';

jest.mock('../../../i18n', () => ({
    t: jest.fn().mockImplementation((key: string) => key),
}));

jest.mock('../../../lib/shuffle-array.ts', () => ({
    shuffleArray: jest.fn(),
}));

describe('BlanksCardComponent', () => {
    (shuffleArray as jest.Mock).mockReturnValue(['test', 'sample', 'example']);
    let mockOnCorrect: jest.Mock;
    let mockOnIncorrect: jest.Mock;
    let mockOnComplete: jest.Mock;
    let props: IBlanksCardProps;

    beforeEach(() => {
        mockOnCorrect = jest.fn();
        mockOnIncorrect = jest.fn();
        mockOnComplete = jest.fn();
        props = {
            card: {
                class: 'blanks',
                qlang: 'target',
                question: 'This is a __ __.',
                words: [
                    { sample: true },
                    { test: true },
                    { example: false },
                ],
            } as IBlanksCard,
            onCorrect: mockOnCorrect,
            onIncorrect: mockOnIncorrect,
            onComplete: mockOnComplete,
        };
    });

    it('should render the component correctly', () => {
        render(() => <BlanksCardComponent {...props} />);

        expect(screen.getByText(props.card.question)).toBeInTheDocument();

        for (const wordObj of props.card.words) {
            const word = Object.keys(wordObj)[0];
            expect(screen.getByText(word)).toBeInTheDocument();
        }
    });

    it('should call onCorrect when a correct word is clicked', async () => {
        render(() => <BlanksCardComponent {...props} />);

        const correctWords = props.card.words.filter(w => Object.values(w)[0]);
        for (const wordObj of correctWords) {
            const word = Object.keys(wordObj)[0];
            fireEvent.click(screen.getByText(word));
        }

        await waitFor(() => {
            expect(mockOnCorrect).toHaveBeenCalledTimes(correctWords.length);
        });

        expect(screen.getByText('This is a sample test.')).toBeInTheDocument();
    });

    it('should call onIncorrect when an incorrect word is clicked', async () => {
        render(() => <BlanksCardComponent {...props} />);

        const incorrectWordObj = props.card.words.find(w => !Object.values(w)[0]);
        if (incorrectWordObj) {
            const incorrectWord = Object.keys(incorrectWordObj)[0];
            fireEvent.click(screen.getByText(incorrectWord));

            await waitFor(() => {
                expect(mockOnIncorrect).toHaveBeenCalledTimes(1);
            });
        }
    });

    it('should call onComplete when all correct words are selected', async () => {
        render(() => <BlanksCardComponent {...props} />);

        const correctWords = props.card.words.filter(w => Object.values(w)[0]);
        for (const wordObj of correctWords) {
            const word = Object.keys(wordObj)[0];
            fireEvent.click(screen.getByText(word));
        }

        fireEvent.click(screen.getByText('next'));

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledTimes(1);
        });
    });

    it('should add the correct CSS classes based on selection', () => {
        render(() => <BlanksCardComponent {...props} />);

        const correctWordObj = props.card.words.find(w => Object.values(w)[0]);
        const incorrectWordObj = props.card.words.find(w => !Object.values(w)[0]);

        if (correctWordObj) {
            const correctWord = Object.keys(correctWordObj)[0];
            fireEvent.click(screen.getByText(correctWord));
            expect(screen.getByText(correctWord)).toHaveClass('correct');
        }

        if (incorrectWordObj) {
            const incorrectWord = Object.keys(incorrectWordObj)[0];
            fireEvent.click(screen.getByText(incorrectWord));
            expect(screen.getByText(incorrectWord)).toHaveClass('shake');
        }
    });
});
