import { createMemo } from 'solid-js';

import { type IBaseCard } from '../BaseCard.type';
import { Lesson } from '../../../Lessons';
import VocabMatchCardComponent, { type IVocabMatchCard } from '../VocabMatch/VocabMatch';

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

type VocabWord = {
    word: string;
    correct: boolean;
}

const DynamicVocabComponent = (props: IDynamicVocabCardProps) => {
    const vocab = createMemo(() => {
        const newVocab: { [key: string]: string } = {};

        for (const lessonCard of props.lesson.cards.filter(card => ['vocab', 'blanks'].includes(card.class))) {
            if (lessonCard.class === 'blanks' && lessonCard.qlang === props.card.qlang) {
                const blankWords = lessonCard.words.filter((wordObj: VocabWord) => wordObj.correct);

                blankWords.forEach((wordObj: VocabWord) => {
                    newVocab[wordObj.word] = wordObj.word;
                });
            }
            else if (lessonCard.class === 'vocab') {
                if (lessonCard.qlang === props.card.qlang) {
                    Object.assign(newVocab, lessonCard.vocab);
                } else {
                    const swappedVocab = Object.fromEntries(
                        Object.entries(lessonCard.vocab).map(([key, value]) => [value, key])
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
