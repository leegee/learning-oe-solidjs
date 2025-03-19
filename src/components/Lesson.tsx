// src/components/Lesson.tsx
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";

import MultipleChoice from './cards/MultipleChoice';
import VocabMatch from './cards/VocabMatch';
import BlanksCard from './cards/BlanksCard';
import WritingCard from './cards/WritingCard';
import WritingBlocksCard from './cards/WritingBlocksCard';
import DynamicVocab from './cards/DynamicVocabCard';
import { type Lesson } from '../Lessons';
import './Lesson.css';

interface LessonProps {
    lesson: Lesson;
    onCorrectAnswer: (numberOfCorrectAnswers?: number) => void;
    onIncorrectAnswer: (incorrectAnswer: string) => void;
    onCancel: () => void;
    onQuestionAnswered: () => void;
    onLessonComplete: () => void;
};

const LessonComponent = ({ lesson, onQuestionAnswered, onCorrectAnswer, onIncorrectAnswer, onCancel, onLessonComplete }: LessonProps) => {
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
    const { t } = useTranslation();

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keyup', handleKeys);
        return () => window.removeEventListener('keyup', handleKeys);
    })

    const goToNextCard = () => {
        onQuestionAnswered();
        if (currentCardIndex < lesson.cards.length - 1) {
            setCurrentCardIndex((prevIndex) => prevIndex + 1);
        } else {
            onLessonComplete();
        }
    };

    const onIncorrect = () => {
        console.log('On Incorrect: ');
        // TODO onIncorrect might receive something to store here
        onIncorrectAnswer(String(currentCardIndex));
    }

    const currentCard = lesson.cards[currentCardIndex];
    const progress = (currentCardIndex + 1) / lesson.cards.length;

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            const confirmationMessage = "Are you sure you want to leave this app?";
            event.preventDefault();
            return confirmationMessage;
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return (
        <article className='lesson'>
            <h2>
                {t('lesson')}: <em>{lesson.title}</em>
                <button className='close-button' onClick={onCancel} />
            </h2>
            <progress
                value={progress}
                max={1}
                aria-label={t('lesson_progress')}
                title={`${currentCardIndex + 1} / ${lesson.cards.length}`}
            ></progress>

            {currentCard.class === 'dynamic-vocab' && (
                <DynamicVocab
                    card={currentCard}
                    lesson={lesson}
                    onComplete={goToNextCard}
                    onCorrect={onCorrectAnswer}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'writing' && (
                <WritingCard
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'writing-blocks' && (
                <WritingBlocksCard
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'multiple-choice' && (
                <MultipleChoice
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onComplete={goToNextCard}
                    onIncorrect={onIncorrect}
                />
            )}

            {currentCard.class === 'vocab' && (
                <VocabMatch
                    card={currentCard}
                    onCorrect={onCorrectAnswer}
                    onIncorrect={onIncorrect}
                    onComplete={goToNextCard}
                />
            )}

            {currentCard.class === 'blanks' && (
                <BlanksCard
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
