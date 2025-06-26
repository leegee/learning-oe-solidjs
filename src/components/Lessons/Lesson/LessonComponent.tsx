import './LessonComponent.css';
import { createSignal, onCleanup, createMemo, createEffect } from 'solid-js';
import { useConfirm } from "../../../contexts/ConfirmProvider";
import { exitFullscreen } from '../../../lib/fullscreen';
import Card from '../Card';
import { type IAnyCard } from '../../Cards';
import { useI18n } from '../../../contexts/I18nProvider';
import LessonProgressIndicator from './LessonProgressIndicator';

export interface ILesson {
    title: string;
    description?: string;
    cards: IAnyCard[]
};

export const DefaultLesson = {
    title: 'A Lesson',
    description: 'A lesson description',
    cards: []
};

export interface ILessonProps {
    lesson: ILesson;
    onAnswer: (cardIndex: number, incorrectAnswer?: string) => void;
    onCancel: () => void;
    onLessonComplete: () => void;
}

const LessonComponent = (props: ILessonProps) => {
    const { t } = useI18n();
    const { showConfirm } = useConfirm();
    const [lessonStack, setLessonStack] = createSignal<IAnyCard[]>([]);
    const currentCard = createMemo(() => (lessonStack() && lessonStack()[0]) ?? null);
    let correctlyAnswered: null | boolean = null;

    createEffect(() => {
        if (props.lesson && props.lesson.cards) {
            setLessonStack(props.lesson.cards);
        }
    })

    const quitLessonIfConfirmed = () => {
        showConfirm(t('confirm_leave_lesson'), () => {
            exitFullscreen();
            props.onCancel();
        })
    };

    const handleKeys = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            quitLessonIfConfirmed();
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
            // Remove the current card so that the top of the stack is the "next question card:""
            setLessonStack((prevStack) => prevStack.slice(1));

            if (lessonStack().length === 0) {
                props.onLessonComplete();
                return;
            }
        } else {
            // Move incorrectly answered card to the bottom of the stack
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

    if (!props.lesson || !props.lesson.cards) {
        return 'Loading lesson cards...';
    }

    return (
        <article class="lesson">
            <h2>
                <em>{props.lesson.title}</em>
                <button class="close-button" onClick={quitLessonIfConfirmed} aria-label={t('cancel_lesson')} />
            </h2>

            <LessonProgressIndicator
                value={lessonStack().length === 0 ? 1 : (props.lesson.cards.length - lessonStack().length + 1)}
                max={props.lesson.cards.length}
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
