import { createMemo } from 'solid-js';

import { Card } from './Card';
import { Lesson } from '../../Lessons';
import VocabMatch, { type VocabCard } from './VocabMatch';

export type DynamicVocabCard = Card & {
    class: 'dynamic-vocab';
    qlang: string;
};

interface DynamicVocabCardProps {
    card: DynamicVocabCard;
    lesson: Lesson;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const DynamicVocab = ({ card, lesson, onCorrect, onIncorrect, onComplete }: DynamicVocabCardProps) => {
    console.log(lesson.cards);

    const vocab = createMemo(() => {
        const newVocab: { [key: string]: string } = {};

        for (const thisCard of lesson.cards.filter(card => ['vocab', 'blanks'].includes(card.class))) {
            if (thisCard.class === 'blanks' && thisCard.qlang === card.qlang) {
                const blankWords = thisCard.words.filter(wordObj => wordObj.correct);
                blankWords.forEach(blank => {
                    newVocab[blank.word] = blank.word;
                });
            } else if (thisCard.class === 'vocab') {
                if (thisCard.qlang === card.qlang) {
                    Object.assign(newVocab, thisCard.vocab);
                } else {
                    const swappedVocab = Object.fromEntries(
                        Object.entries(thisCard.vocab).map(([key, value]) => [value, key])
                    );
                    Object.assign(newVocab, swappedVocab);
                }
            }
        }

        return newVocab;
    });

    // Create the new card
    const newCard: VocabCard = {
        class: 'vocab',
        qlang: card.qlang,
        vocab: vocab() // Dereference the memoized value here
    };

    return (
        <VocabMatch
            card={newCard} // Directly pass the newCard object
            onCorrect={onCorrect}
            onIncorrect={onIncorrect}
            onComplete={onComplete}
        />
    );
};

export default DynamicVocab;
