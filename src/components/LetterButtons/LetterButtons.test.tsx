import { render, screen, fireEvent } from 'solid-testing-library';
import LetterButtons from './LetterButtons';

const mockOnSelect = jest.fn();

describe('LetterButtons', () => {
    test('renders correct letter buttons based on text prop', () => {
        const text = 'æø';

        render(() => (
            <LetterButtons lang="ang" text={text} onSelect={mockOnSelect} />
        ));

        expect(screen.getByText('æ')).toBeInTheDocument();
        expect(screen.getByText('ø')).toBeInTheDocument();
    });

    test('calls onSelect with correct symbol when button is clicked', () => {
        const text = 'æø';

        render(() => (
            <LetterButtons lang="ang" text={text} onSelect={mockOnSelect} />
        ));

        fireEvent.click(screen.getByText('æ'));

        expect(mockOnSelect).toHaveBeenCalledWith('æ');
    });

    test('does not show duplicate buttons', () => {
        const text = 'ææ';

        render(() => (
            <LetterButtons lang="ang" text={text} onSelect={mockOnSelect} />
        ));

        const buttons = screen.getAllByRole('button');

        const buttonSymbols = buttons.map(button => button.textContent);
        const uniqueButtonSymbols = new Set(buttonSymbols);
        expect(uniqueButtonSymbols.size).toBe(buttonSymbols.length);
    });

    test('renders minimum number of buttons', () => {
        const text = 'þ';

        render(() => (
            <LetterButtons lang="ang" text={text} onSelect={mockOnSelect} />
        ));

        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThanOrEqual(3);
    });

    test('renders nothing if there is no input text', () => {
        render(() => (
            <LetterButtons lang="ang" text={''} onSelect={mockOnSelect} />
        ));

        const buttons = screen.queryAllByRole('button');
        expect(buttons.length).toBe(0);
    });

    test('for an unsupported language, renders an empty string and warns', () => {
        const logSpy = jest.spyOn(console, "warn").mockImplementation(() => { });

        render(() => (
            <LetterButtons lang="fish" text={'Bob'} onSelect={mockOnSelect} />
        ));

        expect(screen.queryByText(/./)).toBeNull();
        expect(logSpy).toHaveBeenCalled();

        logSpy.mockRestore();
    });
});
