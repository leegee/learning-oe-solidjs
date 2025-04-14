import { createMemo } from 'solid-js';
import VocabMatchCardComponent, { type IVocabMatchCard } from '../VocabMatch/VocabMatch';
import { type IBaseCard } from '../BaseCard.type';
import { type Lesson } from '../../../routes/Lessons/Lesson';

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

        for (const lessonCard of props.lesson.cards.filter(card => ['vocab', 'blanks'].includes(card.class))) {
            if (lessonCard.class === 'blanks' && lessonCard.qlang === props.card.qlang) {
                // Collect words and their correctness from the blanks card
                lessonCard.words.forEach((wordObj: any) => {
                    const word = Object.keys(wordObj)[0]; // Extract the word from the object
                    const correct = wordObj[word];
                    newVocab[word] = correct ? word : ''; // Only store correct words
                });
            }
            else if (lessonCard.class === 'vocab') {
                if (lessonCard.qlang === props.card.qlang) {
                    Object.assign(newVocab, lessonCard.vocab);
                } else {
                    // Swap the vocab mapping if qlang does not match
                    const swappedVocab = Object.fromEntries(
                        Object.entries(lessonCard.vocab).map(([key, value]) => [value, key])
                    );
                    Object.assign(newVocab, swappedVocab);
                }
            }
        }

        return newVocab;
    });

    // Create the new card with the updated vocab structure
    const newCard: IVocabMatchCard = {
        class: 'vocab',
        qlang: props.card.qlang,
        vocab: vocab() // The vocab now correctly reflects the structure with correctness
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
