import { render, screen, fireEvent, waitFor } from 'solid-testing-library';
import VocabMatchCardComponent, { type IVocabMatchCard, type IVocabMatchCardProps } from './VocabMatch';
import { shuffleArray } from '../../lib/shuffle-array.ts';

jest.mock('../../i18n', () => ({
    t: jest.fn().mockImplementation((key: string) => key),
}));

jest.mock('../../lib/shuffle-array.ts', () => ({
    shuffleArray: jest.fn(),
}));

describe('VocabMatchCardComponent', () => {
    let mockOnCorrect: jest.Mock;
    let mockOnIncorrect: jest.Mock;
    let mockOnComplete: jest.Mock;
    let props: IVocabMatchCardProps;

    beforeEach(() => {
        mockOnCorrect = jest.fn();
        mockOnIncorrect = jest.fn();
        mockOnComplete = jest.fn();
        props = {
            card: {
                class: 'vocab',
                qlang: 'target',
                question: 'Match the word to its translation:',
                vocab: {
                    'dog': 'hund',
                    'cat': 'katt',
                    'bird': 'fågel',
                },
            } as IVocabMatchCard,
            onCorrect: mockOnCorrect,
            onIncorrect: mockOnIncorrect,
            onComplete: mockOnComplete,
        };

        (shuffleArray as jest.Mock).mockReturnValue(['katt', 'fågel', 'hund']);
    });

    it('should render the component correctly', () => {
        render(() => <VocabMatchCardComponent {...props} />);

        Object.keys(props.card.vocab).forEach((word) => {
            expect(screen.getByText(word)).toBeInTheDocument();
            expect(screen.getByText(props.card.vocab[word])).toBeInTheDocument();
        });
    });

    it('should call onComplete when all correct pairs are selected', async () => {
        render(() => <VocabMatchCardComponent {...props} />);

        fireEvent.click(screen.getByText('dog'));
        fireEvent.click(screen.getByText('hund'));

        fireEvent.click(screen.getByText('cat'));
        fireEvent.click(screen.getByText('katt'));

        fireEvent.click(screen.getByText('bird'));
        fireEvent.click(screen.getByText('fågel'));

        fireEvent.click(screen.getByText('next')); // The "next" button

        await waitFor(() => {
            expect(mockOnComplete).toHaveBeenCalledTimes(1);
        });
    });

    describe('should add CSS classes', () => {
        beforeEach(() => {
            render(() => <VocabMatchCardComponent {...props} />);
        });

        it('for a correct match', () => {
            fireEvent.click(screen.getByText('dog'));
            expect(screen.getByText('dog')).toHaveClass('selected');
            fireEvent.click(screen.getByText('hund'));
            expect(screen.getByText('hund')).toHaveClass(' vocab-match right-word matched');
        });

        it(' for an incorrect match', () => {
            fireEvent.click(screen.getByText('dog'));
            fireEvent.click(screen.getByText('katt'));
            expect(screen.getByText('dog')).toHaveClass('shake');
            expect(screen.getByText('katt')).toHaveClass('shake');
        });
    });

});
