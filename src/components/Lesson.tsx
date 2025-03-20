import { createSignal, onCleanup, Switch, Match } from 'solid-js';
import { t } from '../i18n';

import MultipleChoiceComponent, { IMultipleChoiceCard } from './cards/MultipleChoice';
import VocabMatchCardComponent, { IVocabMatchCard } from './cards/VocabMatch';
import BlanksCardComponent, { IBlanksCard } from './cards/BlanksCard';
import WritingCardComponent, { IWritingCard } from './cards/WritingCard';
import WritingBlocksCardComponent, { IWritingBlocksCard } from './cards/WritingBlocksCard';
import DynamicVocabComponent, { IDynamicVocabCard } from './cards/DynamicVocabCard';
import { type Lesson } from '../Lessons';
import './Lesson.css';

interface ILessonProps {
    lesson: Lesson;
    onCorrectAnswer: (numberOfCorrectAnswers?: number) => void;
    onIncorrectAnswer: (incorrectAnswer: string) => void;
    onCancel: () => void;
    onQuestionAnswered: () => void;
    onLessonComplete: () => void;
}

const LessonComponent = (props: ILessonProps) => {
    const [currentCardIndex, setCurrentCardIndex] = createSignal<number>(0);

    const currentCard = () => props.lesson.cards[currentCardIndex()];
    const progress = (currentCardIndex() + 1) / props.lesson.cards.length;

    // Handle keyboard events for Escape key
    const handleKeys = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            props.onCancel();
        }
    };

    // Handle beforeunload event
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
        props.onQuestionAnswered();
        if (currentCardIndex() < props.lesson.cards.length - 1) {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        } else {
            props.onLessonComplete();
        }
    };

    const onIncorrect = () => {
        console.log('On Incorrect');
        props.onIncorrectAnswer(String(currentCardIndex()));
    };

    return (
        <article class="lesson">
            <h2>
                {t('lesson')}: <em>{props.lesson.title}</em>
                <button class="close-button" onClick={props.onCancel} aria-label={t('lesson_progress')} />
            </h2>

            <progress
                value={progress}
                max={1}
                aria-label={t('lesson_progress')}
                title={`${currentCardIndex() + 1} / ${props.lesson.cards.length}`}
            />

            <Switch fallback={<p>Unknown lesson card...</p>}>
                <Match when={currentCard().class === 'dynamic-vocab'}>
                    <DynamicVocabComponent
                        card={currentCard() as IDynamicVocabCard}
                        lesson={props.lesson}
                        onComplete={goToNextCard}
                        onCorrect={props.onCorrectAnswer}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing'}>
                    <WritingCardComponent
                        card={currentCard() as IWritingCard}
                        onCorrect={props.onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing-blocks'}>
                    <WritingBlocksCardComponent
                        card={currentCard() as IWritingBlocksCard}
                        onCorrect={props.onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'multiple-choice'}>
                    <MultipleChoiceComponent
                        card={currentCard() as IMultipleChoiceCard}
                        onCorrect={props.onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'vocab'}>
                    <VocabMatchCardComponent
                        card={currentCard() as IVocabMatchCard}
                        onCorrect={props.onCorrectAnswer}
                        onIncorrect={onIncorrect}
                        onComplete={goToNextCard}
                    />
                </Match>

                <Match when={currentCard().class === 'blanks'}>
                    <BlanksCardComponent
                        card={currentCard() as IBlanksCard}
                        onCorrect={props.onCorrectAnswer}
                        onIncorrect={onIncorrect}
                        onComplete={goToNextCard}
                    />
                </Match>
            </Switch>
        </article>
    );
};

export default LessonComponent;
