import { screen, fireEvent, waitFor } from 'solid-testing-library';
import { renderTestElement } from '../../../jest.setup';
import LessonComponent, { type Lesson } from './Lesson';
import { IMultipleChoiceCard } from '../cards';

jest.mock('../cards', () => ({
    MultipleChoiceComponent: (props: any) => (
        <div>
            <h3>{props.card.question}</h3>
            <button onClick={() => props.onComplete()}>Next</button>
            <button onClick={() => props.onCorrect()}>Correct</button>
            <button onClick={() => props.onIncorrect()}>Incorrect</button>
        </div>
    ),
    WritingCardComponent: jest.fn(),
    WritingBlocksCardComponent: jest.fn(),
    VocabMatchCardComponent: jest.fn(),
    BlanksCardComponent: jest.fn(),
}));

jest.mock('../../i18n', () => ({
    t: jest.fn().mockImplementation((key: string) => key),
}));

describe('LessonComponent', () => {
    const lesson: Lesson = {
        title: 'Test Lesson',
        cards: [
            {
                class: 'multiple-choice',
                question: 'What is 2+2?',
                answers: ['3', '4', '5'],
                answer: '4',
            } as IMultipleChoiceCard,
            {
                class: 'multiple-choice',
                question: 'What is 3+5?',
                answers: ['7', '8', '9'],
                answer: '8',
            } as IMultipleChoiceCard,
        ],
    };

    let onAnswer: jest.Mock;
    let onCancel: jest.Mock;
    let onLessonComplete: jest.Mock;

    beforeEach(() => {
        onAnswer = jest.fn();
        onCancel = jest.fn();
        onLessonComplete = jest.fn();
    });

    it('should render a lesson and call onCorrect when the correct button is clicked', async () => {
        renderTestElement(
            LessonComponent,
            { lesson, onAnswer, onCancel, onLessonComplete }
        );

        await waitFor(() => expect(onAnswer).toHaveBeenCalledTimes(0));
        await waitFor(() => expect(onLessonComplete).toHaveBeenCalledTimes(0));

        await waitFor(() => expect(
            screen.getByText(lesson.cards[0].question!)
        ).toBeInTheDocument());

        let incorrect = await waitFor(() => screen.getByText('Incorrect'));
        fireEvent.click(incorrect);

        let next = await waitFor(() => screen.getByText('Next'));
        fireEvent.click(next);

        await waitFor(() => expect(onAnswer).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(onLessonComplete).toHaveBeenCalledTimes(0));

        await waitFor(() => expect(
            screen.getByText(lesson.cards[1].question!)
        ).toBeInTheDocument());

        let correct = await waitFor(() => screen.getByText('Correct'));
        fireEvent.click(correct);

        next = await waitFor(() => screen.getByText('Next'));
        fireEvent.click(next);

        await waitFor(() => expect(onAnswer).toHaveBeenCalledTimes(2));
        await waitFor(() => expect(onLessonComplete).toHaveBeenCalledTimes(0));

        await waitFor(() => expect(
            screen.getByText(lesson.cards[0].question!)
        ).toBeInTheDocument());

        correct = await waitFor(() => screen.getByText('Correct'));
        fireEvent.click(correct);

        next = await waitFor(() => screen.getByText('Next'));
        fireEvent.click(next);

        await waitFor(() => expect(onAnswer).toHaveBeenCalledTimes(3));
        await waitFor(() => expect(onLessonComplete).toHaveBeenCalledTimes(1));
    });

});
