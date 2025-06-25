import BlanksCardComponent, { IBlanksCard } from './Blanks.tsx';
import { render, screen, fireEvent, waitFor } from '@solidjs/testing-library';
import { jest } from '@jest/globals';

const defaultCard: IBlanksCard = {
    class: 'blanks',
    question: '__ sample __ test',
    qlang: "default",
    words: [
        { sample: true },
        { other: false },
        { test: true },
    ],
};

describe('BlanksCardComponent', () => {
    const setup = () => {
        const props = {
            card: defaultCard,
            onCorrect: jest.fn(),
            onIncorrect: jest.fn(),
            onComplete: jest.fn(),
        };

        render(() => <BlanksCardComponent {...props} />);
        return props;
    };

    it('calls onCorrect when a correct sequence is selected and checked', async () => {
        const props = setup();

        fireEvent.click(screen.getByRole('button', { name: /select sample/i }));
        fireEvent.click(screen.getByRole('button', { name: /select test/i }));
        fireEvent.click(screen.getByLabelText('action-button'));

        await waitFor(() => {
            expect(props.onCorrect).toHaveBeenCalledWith(2);
        });
    });

    it('calls onIncorrect when incorrect sequence is selected and checked', async () => {
        const props = setup();

        fireEvent.click(screen.getByRole('button', { name: /select other/i }));
        fireEvent.click(screen.getByLabelText('action-button'));

        await waitFor(() => {
            expect(props.onIncorrect).toHaveBeenCalled();
        });
    });

    it('calls onComplete after correct check and clicking Next', async () => {
        const props = setup();

        fireEvent.click(screen.getByRole('button', { name: /select sample/i }));
        fireEvent.click(screen.getByRole('button', { name: /select test/i }));
        fireEvent.click(screen.getByLabelText('action-button'));

        await waitFor(() => {
            expect(props.onCorrect).toHaveBeenCalled();
        });

        fireEvent.click(screen.getByLabelText('action-button'));
        expect(props.onComplete).toHaveBeenCalled();
    });
});
