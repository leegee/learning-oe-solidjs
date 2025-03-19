import { createSignal, onCleanup } from 'solid-js';
import { t } from '../i18n';

import MultipleChoiceComponent from './cards/MultipleChoice';
import VocabMatchCardComponent from './cards/VocabMatch';
import BlanksCardComponent from './cards/BlanksCard';
import WritingCardComponent from './cards/WritingCard';
import WritingBlocksCardComponent from './cards/WritingBlocksCard';
import DynamicVocabComponent from './cards/DynamicVocabCard';
import { type Lesson } from '../Lessons';
import './Lesson.css';

interface LessonProps {
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
}: LessonProps) => {
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

    const currentCard = lesson.cards[currentCardIndex()];
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

            {currentCard.class === 'dynamic-vocab' && (
                <DynamicVocabComponent
                    card={currentCard}
                    lesson={lesson}
                    onComplete={goToNextCard}
                    onCorrect={onCorrectAnswer}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'writing' && (
                <WritingCardComponent
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'writing-blocks' && (
                <WritingBlocksCardComponent
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'multiple-choice' && (
                <MultipleChoiceComponent
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'vocab' && (
                <VocabMatchCardComponent
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onIncorrect={onIncorrect}
                    onComplete={goToNextCard}
                />
            )}

            {currentCard.class === 'blanks' && (
                <BlanksCardComponent
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onIncorrect={onIncorrect}
                    onComplete={goToNextCard}
                />
            )}
        </article>
    );
};

export default LessonComponent;
