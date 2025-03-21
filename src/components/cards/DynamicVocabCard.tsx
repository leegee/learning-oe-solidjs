import { createMemo } from 'solid-js';

import { type IBaseCard } from './BaseCard.type';
import { Lesson } from '../../Lessons';
import VocabMatchCardComponent, { type IVocabMatchCard } from './VocabMatch';

export interface IDynamicVocabCard extends IBaseCard {
    class: 'dynamic-vocab';
};

interface IDynamicVocabCardProps {
    card: IDynamicVocabCard;
    lesson: Lesson;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const DynamicVocabComponent = (props: IDynamicVocabCardProps) => {
    const vocab = createMemo(() => {
        const newVocab: { [key: string]: string } = {};

        for (const thisCard of props.lesson.cards.filter(card => ['vocab', 'blanks'].includes(card.class))) {
            if (thisCard.class === 'blanks' && thisCard.qlang === props.card.qlang) {
                const blankWords = thisCard.words.filter(wordObj => wordObj.correct);
                blankWords.forEach(blank => {
                    newVocab[blank.word] = blank.word;
                });
            } else if (thisCard.class === 'vocab') {
                if (thisCard.qlang === props.card.qlang) {
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
    const newCard: IVocabMatchCard = {
        class: 'vocab',
        qlang: props.card.qlang,
        vocab: vocab()
    };

    return (
        <VocabMatchCardComponent
            card={newCard}
            onCorrect={props.onCorrect}
            onIncorrect={props.onIncorrect}
            onComplete={props.onComplete}
        />
    );
};

export default DynamicVocabComponent;
