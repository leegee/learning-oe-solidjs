import { createSignal, onCleanup, Switch, Match, createMemo, createEffect } from 'solid-js';
import { t } from '../i18n';
import type { Lesson } from '../Lessons';
import type {
    IBlanksCard,
    IDynamicVocabCard,
    IMultipleChoiceCard,
    IVocabMatchCard,
    IWritingBlocksCard,
    IWritingCard
} from './cards';
import {
    BlanksCardComponent,
    DynamicVocabComponent,
    MultipleChoiceComponent,
    VocabMatchCardComponent,
    WritingBlocksCardComponent,
    WritingCardComponent
} from './cards';
import './Lesson.css';

export interface ILessonProps {
    lesson: Lesson;
    onAnswer: (cardIndex: number, incorrectAnswer?: string) => void;
    onCancel: () => void;
    onLessonComplete: () => void;
}

const LessonComponent = (props: ILessonProps) => {
    const [lessonStack, setLessonStack] = createSignal(props.lesson.cards);
    const currentCard = createMemo(() => lessonStack()[0] ?? null);
    let correctlyAnswered: null | boolean = null;

    createEffect(() => {
        console.log('Rendering card:', currentCard());
    });

    const handleKeys = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            props.onCancel();
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


    const goToNextCard = () => {
        // console.log('Enter goToNextCard correctlyAnswered=', correctlyAnswered, 'stack =', lessonStack());

        if (correctlyAnswered) {
            setLessonStack((prevStack) => {
                const updatedStack = prevStack.slice(1);  // Remove the first card
                console.log('Updated lessonStack after correct answer =', updatedStack);
                return updatedStack;
            });

            if (lessonStack().length === 0) {
                props.onLessonComplete();
                return;
            }
        } else {
            // Move incorrectly answered card to the other end of the stack
            setLessonStack((prevStack) => {
                const currentCard = prevStack[0];
                const updatedStack = [...prevStack.slice(1), currentCard];
                console.log('Updated lessonStack after incorrect answer =', updatedStack);
                return updatedStack;
            });
        }
    };

    const onIncorrect = () => {
        console.log('Enter onIncorrect');
        correctlyAnswered = false;
        const currentCardIndex = props.lesson.cards.indexOf(lessonStack()[0]);
        props.onAnswer(currentCardIndex, 'bad_answer_goes_here');
    };

    const onCorrect = () => {
        console.log('Enter onCorrect');
        correctlyAnswered = true;
        const currentCardIndex = props.lesson.cards.indexOf(lessonStack()[0]);
        props.onAnswer(currentCardIndex);
    };

    return (
        <article class="lesson">
            <h2>
                {t('lesson')}: <em>{props.lesson.title}</em>
                <button class="close-button" onClick={props.onCancel} aria-label={t('lesson_progress')} />
            </h2>

            <progress
                value={lessonStack().length === 0 ? 1 : (props.lesson.cards.length - lessonStack().length + 1)}
                max={props.lesson.cards.length}
                aria-label={t('lesson_progress')}
                title={`${props.lesson.cards.length - lessonStack().length + 1} / ${props.lesson.cards.length}`}
            />

            <Switch fallback={<p>Unknown lesson card...</p>}>
                <Match when={!currentCard()}>
                    <p>{t('lesson_complete')}</p>
                </Match>

                <Match when={currentCard().class === 'dynamic-vocab'}>
                    <DynamicVocabComponent
                        card={currentCard() as IDynamicVocabCard}
                        lesson={props.lesson}
                        onComplete={goToNextCard}
                        onCorrect={onCorrect}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing'}>
                    <WritingCardComponent
                        card={currentCard() as IWritingCard}
                        onComplete={goToNextCard}
                        onCorrect={onCorrect}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing-blocks'}>
                    <WritingBlocksCardComponent
                        card={currentCard() as IWritingBlocksCard}
                        onComplete={goToNextCard}
                        onCorrect={onCorrect}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'multiple-choice'}>
                    <MultipleChoiceComponent
                        card={currentCard() as IMultipleChoiceCard}
                        onComplete={goToNextCard}
                        onCorrect={onCorrect}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'vocab'}>
                    <VocabMatchCardComponent
                        card={currentCard() as IVocabMatchCard}
                        onIncorrect={onIncorrect}
                        onCorrect={onCorrect}
                        onComplete={goToNextCard}
                    />
                </Match>

                <Match when={currentCard().class === 'blanks'}>
                    <BlanksCardComponent
                        card={currentCard() as IBlanksCard}
                        onIncorrect={onIncorrect}
                        onCorrect={onCorrect}
                        onComplete={goToNextCard}
                    />
                </Match>
            </Switch>
        </article >
    );
};

export default LessonComponent;
