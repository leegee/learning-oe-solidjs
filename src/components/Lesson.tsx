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

const LessonComponent = ({
    lesson,
    onQuestionAnswered,
    onCorrectAnswer,
    onIncorrectAnswer,
    onCancel,
    onLessonComplete,
}: ILessonProps) => {
    const [currentCardIndex, setCurrentCardIndex] = createSignal<number>(0);

    // Handle keyboard events for Escape key
    const handleKeys = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
            onCancel();
        }
    };

    window.addEventListener('keyup', handleKeys);

    onCleanup(() => {
        window.removeEventListener('keyup', handleKeys);
    });

    const goToNextCard = () => {
        onQuestionAnswered();
        if (currentCardIndex() < lesson.cards.length - 1) {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        } else {
            onLessonComplete();
        }
    };

    const onIncorrect = () => {
        console.log('On Incorrect: ');
        // TODO onIncorrect might receive something to store here
        onIncorrectAnswer(String(currentCardIndex()));
    };

    const currentCard = () => lesson.cards[currentCardIndex()];
    const progress = (currentCardIndex() + 1) / lesson.cards.length;

    // Handle beforeunload event
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
        const confirmationMessage = 'Are you sure you want to leave this app?';
        event.preventDefault();
        return confirmationMessage;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    onCleanup(() => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
    });

    return (
        <article class="lesson">
            <h2>
                {t('lesson')}: <em>{lesson.title}</em>
                <button class="close-button" onClick={onCancel} />
            </h2>
            <progress
                value={progress}
                max={1}
                aria-label={t('lesson_progress')}
                title={`${currentCardIndex() + 1} / ${lesson.cards.length}`}
            ></progress>

            <Switch fallback={<p>Unknown lesson card...</p>}>
                <Match when={currentCard().class === 'dynamic-vocab'}>
                    <DynamicVocabComponent
                        card={currentCard() as IDynamicVocabCard}
                        lesson={lesson}
                        onComplete={goToNextCard}
                        onCorrect={onCorrectAnswer}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing'}>
                    <WritingCardComponent
                        card={currentCard() as IWritingCard}
                        onCorrect={onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'writing-blocks'}>
                    <WritingBlocksCardComponent
                        card={currentCard() as IWritingBlocksCard}
                        onCorrect={onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'multiple-choice'}>
                    <MultipleChoiceComponent
                        card={currentCard() as IMultipleChoiceCard}
                        onCorrect={onCorrectAnswer}
                        onComplete={goToNextCard}
                        onIncorrect={onIncorrect}
                    />
                </Match>

                <Match when={currentCard().class === 'vocab'}>
                    <VocabMatchCardComponent
                        card={currentCard() as IVocabMatchCard}
                        onCorrect={onCorrectAnswer}
                        onIncorrect={onIncorrect}
                        onComplete={goToNextCard}
                    />
                </Match>

                <Match when={currentCard().class === 'blanks'}>
                    <BlanksCardComponent
                        card={currentCard() as IBlanksCard}
                        onCorrect={onCorrectAnswer}
                        onIncorrect={onIncorrect}
                        onComplete={goToNextCard}
                    />
                </Match>
            </Switch>

        </article>
    );
};

export default LessonComponent;
