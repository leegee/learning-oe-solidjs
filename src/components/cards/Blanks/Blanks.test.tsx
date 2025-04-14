import { screen, fireEvent, waitFor } from 'solid-testing-library';
import BlanksCardComponent, { IBlanksCardProps } from './Blanks';
import { t } from '../../../lib/i18n.ts';
import { renderTestElement } from '../../../../jest.setup.tsx';

jest.mock("../../../lib/i18n", () => ({
    t: (key: string) => key,
}));

describe('BlanksCardComponent', () => {
    let props: IBlanksCardProps;

    beforeEach(() => {
        props = {
            card: {
                class: 'blanks',
                qlang: 'default',
                question: 'This is a __ __.',
                words: [
                    { example: true },
                    { test: false },
                    { sample: true }
                ]
            },
            onCorrect: jest.fn(),
            onIncorrect: jest.fn(),
            onComplete: jest.fn()
        };
    });

    test('should render the component correctly', () => {
        renderTestElement(BlanksCardComponent, props);
        expect(screen.getByText(t('fill_in_the_blanks'))).toBeInTheDocument();
    });

    test('should call onCorrect when a correct word is clicked', () => {
        renderTestElement(BlanksCardComponent, props);
        let correctWord = screen.getByText('example');
        fireEvent.click(correctWord);
        correctWord = screen.getByText('sample');
        fireEvent.click(correctWord);
        expect(props.onCorrect).toHaveBeenCalledTimes(2);
    });

    test('should call onIncorrect when an incorrect word is clicked', () => {
        renderTestElement(BlanksCardComponent, props);
        const incorrectWord = screen.getByText('test');
        fireEvent.click(incorrectWord);
        expect(props.onIncorrect).toHaveBeenCalled();
    });

    test('should call onComplete when all correct words are selected and Next clicked', () => {
        renderTestElement(BlanksCardComponent, props);
        fireEvent.click(screen.getByText('example'));
        fireEvent.click(screen.getByText('sample'));
        fireEvent.click(screen.getByLabelText('action-button'));
        expect(props.onComplete).toHaveBeenCalled();
    });


    describe('should add the correct CSS classes', () => {
        test('on a correct selection', async () => {
            renderTestElement(BlanksCardComponent, props);

            const correctWord = screen.getByText('example');
            expect(correctWord).toHaveClass('word-option');

            fireEvent.click(correctWord);
            const insertedWord = screen.getByRole('button', { name: 'example' });
            await waitFor(() => expect(insertedWord).toHaveClass('word-option correct'));
        });

        test('on an incorrect selection', async () => {
            renderTestElement(BlanksCardComponent, props);

            const incorrectWord = screen.getByText('test');
            expect(incorrectWord).toHaveClass('word-option');

            fireEvent.click(incorrectWord);
            const clickedWord = screen.getByText('test');
            await waitFor(() => expect(clickedWord).toHaveClass('word-option shake'));
        });
    });

});


