// BlanksCard.tsx
import { createSignal, createEffect, For } from 'solid-js';
import { t } from '../../i18n';

import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type IBaseCard } from './BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import './BlanksCard.css';

export interface IBlanksCard extends IBaseCard {
    class: 'blanks';
    question: string;
    words: { word: string; correct: boolean }[]; // Array of words with a correct boolean flag
};

interface IBlanksCardProps {
    card: IBlanksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const BlanksCardComponent = ({ card, onCorrect, onIncorrect, onComplete }: IBlanksCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledWords, setShuffledWords] = createSignal<string[]>([]);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
    const [isComplete, setIsComplete] = createSignal(false);
    const [currentSentence, setCurrentSentence] = createSignal<string>(card.question);
    const [shake, setShake] = createSignal<string | null>(null);

    createEffect(() => {
        setShuffledWords(shuffleArray(card.words.map(word => word.word)));
        setLangs(setQandALangs(card));
    });

    const handleWordClick = (word: string) => {
        const firstBlankIndex = currentSentence().indexOf('__');

        if (firstBlankIndex === -1) {
            return;
        }

        const isCorrect = card.words.find((item) => item.word === word && item.correct);

        if (isCorrect) {
            const expectedWord = card.words.filter(word => word.correct)[selectedWords().length].word;

            if (word === expectedWord) {
                onCorrect();
                setSelectedWords([...selectedWords(), word]);
                let updatedSentence = currentSentence();
                updatedSentence = updatedSentence.replace(/__+/, word);
                setCurrentSentence(updatedSentence);
            } else {
                // Word is correct but out of order
                setShake(word);
                setTimeout(() => setShake(null), 1000);
                onIncorrect();
            }
        } else {
            // Word is incorrect
            setShake(word);
            setTimeout(() => setShake(null), 1000);
            onIncorrect();
        }
    };

    // Check if all correct words are selected in the correct order
    createEffect(() => {
        const correctOrder = card.words.filter(word => word.correct).map(item => item.word);
        if (selectedWords().length === correctOrder.length && selectedWords().every((word, index) => word === correctOrder[index])) {
            setIsComplete(true);
        }
    });

    const handleNextClick = () => {
        if (isComplete()) {
            onComplete();
        }
    };

    return (
        <>
            <section class="card blanks-card">

                <h4>{t('fill_in_the_blanks')}</h4>
                <h3 class="question" lang={langs().q}>{currentSentence()}</h3>

                <div class="word-options">
                    <For each={shuffledWords()}>
                        {(word) => {
                            const isSelected = selectedWords().includes(word);
                            const isCorrect = card.words.find((item) => item.word === word && item.correct);

                            return (
                                <button
                                    lang={langs().a}
                                    onClick={() => handleWordClick(word)}
                                    disabled={isSelected}
                                    class={
                                        `word-option 
                                    ${isSelected ? isCorrect ? 'correct' : 'incorrect' : ''}
                                    ${shake() === word ? 'shake' : ''}
                                `
                                    }
                                >
                                    {word}
                                </button>
                            );
                        }}
                    </For>
                </div>
            </section>

            {isComplete() && (
                <button class="next-button" onClick={handleNextClick}>
                    {t('next')}
                </button>
            )}
        </>
    );
};

export default BlanksCardComponent;
