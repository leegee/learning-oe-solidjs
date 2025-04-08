import { createSignal, onCleanup, createMemo } from 'solid-js';
import { useConfirm } from "../../contexts/Confirm";
import { t } from '../../i18n';
import { exitFullscreen } from '../../lib/fullscreen';
import Card from '../Card';
import {
    type IBlanksCard,
    type IDynamicVocabCard,
    type IMultipleChoiceCard,
    type IVocabMatchCard,
    type IWritingBlocksCard,
    type IWritingCard
} from '../cards';
import './Lesson.css';

export interface Lesson {
    title: string;
    description?: string;
    cards: (IWritingCard | IWritingBlocksCard | IVocabMatchCard | IBlanksCard | IMultipleChoiceCard | IDynamicVocabCard)[];
};

export interface ILessonProps {
    lesson: Lesson;
    onAnswer: (cardIndex: number, incorrectAnswer?: string) => void;
    onCancel: () => void;
    onLessonComplete: () => void;
}

const LessonComponent = (props: ILessonProps) => {
    const { showConfirm } = useConfirm();
    const [lessonStack, setLessonStack] = createSignal(props.lesson.cards);
    const currentCard = createMemo(() => lessonStack()[0] ?? null);
    let correctlyAnswered: null | boolean = null;

    const leaveIfConfirmed = () => {
        showConfirm(t('confirm_leave_lesson'), () => {
            exitFullscreen();
            props.onCancel();
        })
    };

    const handleKeys = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            leaveIfConfirmed();
        }
    };

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        const confirmationMessage = t('confirm_leave_app');
        event.preventDefault();
        return confirmationMessage;
    };

    window.addEventListener('keyup', handleKeys);
    window.addEventListener('beforeunload', handleBeforeUnload);

    onCleanup(() => {
        window.removeEventListener('keyup', handleKeys);
        window.removeEventListener('beforeunload', handleBeforeUnload);
    });


    const goToNextQuestionCard = () => {
        if (correctlyAnswered) {
            // Remove the first card
            setLessonStack((prevStack) => prevStack.slice(1));

            if (lessonStack().length === 0) {
                props.onLessonComplete();
                return;
            }
        } else {
            // Move incorrectly answered card to the other end of the stack
            setLessonStack((prevStack) => [...prevStack.slice(1), prevStack[0]]);
        }
    };

    const onIncorrect = () => {
        correctlyAnswered = false;
        const currentCardIndex = props.lesson.cards.indexOf(lessonStack()[0]);
        props.onAnswer(currentCardIndex, 'bad_answer_goes_here');
    };

    const onCorrect = () => {
        correctlyAnswered = true;
        const currentCardIndex = props.lesson.cards.indexOf(lessonStack()[0]);
        props.onAnswer(currentCardIndex);
    };

    return (
        <article class="lesson">
            <h2>
                <em>{props.lesson.title}</em>
                <button class="close-button" onClick={leaveIfConfirmed} aria-label={t('lesson_progress')} />
            </h2>

            <progress
                value={lessonStack().length === 0 ? 1 : (props.lesson.cards.length - lessonStack().length + 1)}
                max={props.lesson.cards.length}
                aria-label={t('lesson_progress')}
                title={`${props.lesson.cards.length - lessonStack().length + 1} / ${props.lesson.cards.length}`}
            />

            <Card
                card={currentCard()}
                lesson={props.lesson}
                onComplete={goToNextQuestionCard}
                onCorrect={onCorrect}
                onIncorrect={onIncorrect}
            />
        </article >
    );
};

export default LessonComponent;
