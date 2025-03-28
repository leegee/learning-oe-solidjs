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
                    { word: 'sample', correct: true },
                    { word: 'test', correct: true },
                    { word: 'example', correct: false },
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
        for (const i of props.card.words) {
            expect(screen.getByText(i.word)).toBeInTheDocument();
            expect(screen.getByText(i.word)).toBeInTheDocument();
            expect(screen.getByText(i.word)).toBeInTheDocument();
        }
    });

    it('should call onCorrect when a correct word is clicked', async () => {
        render(() => <BlanksCardComponent {...props} />);

        fireEvent.click(screen.getByText(props.card.words[0].word));

        await waitFor(() => {
            expect(mockOnCorrect).toHaveBeenCalledTimes(1);
        });

        fireEvent.click(screen.getByText(props.card.words[1].word));

        await waitFor(() => {
            expect(mockOnCorrect).toHaveBeenCalledTimes(2);
        });

        expect(screen.getByText('This is a sample test.')).toBeInTheDocument();
    });

    it('should call onIncorrect when an incorrect word is clicked', async () => {
        render(() => <BlanksCardComponent {...props} />);

        fireEvent.click(screen.getByText('example'));

        await waitFor(() => {
            expect(mockOnIncorrect).toHaveBeenCalledTimes(1);
        });
    });

    it('should call onComplete when all correct words are selected', async () => {
        render(() => <BlanksCardComponent {...props} />);

        fireEvent.click(screen.getByText(props.card.words[0].word));
        fireEvent.click(screen.getByText(props.card.words[1].word));

        fireEvent.click(screen.getByText('next'));

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledTimes(1);
        });
    });

    it('should add the correct CSS classes based on selection', () => {
        render(() => <BlanksCardComponent {...props} />);

        fireEvent.click(screen.getByText(props.card.words[0].word));
        expect(screen.getByText('sample')).toHaveClass('correct');

        fireEvent.click(screen.getByText(props.card.words[2].word));
        expect(screen.getByText('example')).toHaveClass('shake');
    });
});
