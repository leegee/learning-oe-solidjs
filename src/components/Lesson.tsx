import { createSignal, onCleanup, Switch, Match, createMemo, createEffect } from 'solid-js';
import { t } from '../i18n';

import MultipleChoiceComponent, { type IMultipleChoiceCard } from './cards/MultipleChoice';
import VocabMatchCardComponent, { type IVocabMatchCard } from './cards/VocabMatch';
import BlanksCardComponent, { type IBlanksCard } from './cards/BlanksCard';
import WritingCardComponent, { type IWritingCard } from './cards/WritingCard';
import WritingBlocksCardComponent, { type IWritingBlocksCard } from './cards/WritingBlocksCard';
import DynamicVocabComponent, { type IDynamicVocabCard } from './cards/DynamicVocabCard';
import { type Lesson } from '../Lessons';
import './Lesson.css';

interface ILessonProps {
    lesson: Lesson;
    onAnswer: (cardIndex: number, incorrectAnswer?: string) => void;
    onCancel: () => void;
    onLessonComplete: () => void;
}

const LessonComponent = (props: ILessonProps) => {
    const [lessonQueue, setLessonQueue] = createSignal(props.lesson.cards);
    const currentCard = createMemo(() => lessonQueue()[0] ?? null);
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
        console.log('Go to next card, enter with lessonQueue =', lessonQueue());

        if (correctlyAnswered) {
            // Update the queue state and use new signal reference
            setLessonQueue((prevQueue) => {
                const updatedQueue = prevQueue.slice(1);  // Remove the first card
                console.log('Updated lessonQueue after correct answer =', updatedQueue);
                return updatedQueue;
            });

            // If no cards are left, complete the lesson
            if (lessonQueue().length === 0) {
                props.onLessonComplete();
                return;
            }
        } else {
            // Move incorrectly answered card to the end of the queue
            setLessonQueue((prevQueue) => {
                const currentCard = prevQueue[0];
                const updatedQueue = [...prevQueue.slice(1), currentCard];
                console.log('Updated lessonQueue after incorrect answer =', updatedQueue);
                return updatedQueue;
            });
        }
    };

    const onIncorrect = () => {
        correctlyAnswered = false;
        const currentCardIndex = props.lesson.cards.indexOf(lessonQueue()[0]);
        props.onAnswer(currentCardIndex, 'bad_answer_goes_here');
    };

    const onCorrect = () => {
        correctlyAnswered = true;
        const currentCardIndex = props.lesson.cards.indexOf(lessonQueue()[0]);
        props.onAnswer(currentCardIndex);
    };

    createEffect(() => {
        console.log('lessonQueue', lessonQueue())
        console.log('curentCard', currentCard());
    });

    return (
        <article class="lesson">
            <h2>
                {t('lesson')}: <em>{props.lesson.title}</em>
                <button class="close-button" onClick={props.onCancel} aria-label={t('lesson_progress')} />
            </h2>

            <progress
                value={lessonQueue().length === 0 ? 1 : (props.lesson.cards.length - lessonQueue().length + 1)}
                max={props.lesson.cards.length}
                aria-label={t('lesson_progress')}
                title={`${props.lesson.cards.length - lessonQueue().length + 1} / ${props.lesson.cards.length}`}
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
