// BlanksCard.tsx
import { createSignal, createEffect } from 'solid-js';
import { t } from '../../../i18n';

import { shuffleArray } from '../../../lib/shuffle-array.ts';
import { type IBaseCard } from '../BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../../lib/set-q-and-a-langs.ts';
import './Blanks.css';

export interface IBlanksCard extends IBaseCard {
    class: 'blanks';
    question: string;
    words: { word: string; correct: boolean }[]; // Array of words with a correct boolean flag
};

export interface IBlanksCardProps {
    card: IBlanksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const BlanksCardComponent = (props: IBlanksCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(props.card));
    const [shuffledWords, setShuffledWords] = createSignal<string[]>([]);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
    const [isComplete, setIsComplete] = createSignal(false);
    const [currentSentence, setCurrentSentence] = createSignal<string>(props.card.question);
    const [shake, setShake] = createSignal<string | null>(null);

    createEffect(() => {
        setShuffledWords(shuffleArray(props.card.words.map(word => word.word)));
        setLangs(setQandALangs(props.card));
    });

    const handleWordClick = (word: string) => {
        const firstBlankIndex = currentSentence().indexOf('__');

        if (firstBlankIndex === -1) {
            return;
        }

        const isCorrect = props.card.words.find((item) => item.word === word && item.correct);

        if (isCorrect) {
            const expectedWord = props.card.words.filter(word => word.correct)[selectedWords().length].word;

            if (word === expectedWord) {
                props.onCorrect();
                setSelectedWords([...selectedWords(), word]);
                let updatedSentence = currentSentence();
                updatedSentence = updatedSentence.replace(/__+/, word);
                setCurrentSentence(updatedSentence);
            } else {
                // Word is correct but out of order
                setShake(word);
                setTimeout(() => setShake(null), 1000);
                props.onIncorrect();
            }
        } else {
            // Word is incorrect
            setShake(word);
            setTimeout(() => setShake(null), 1000);
            props.onIncorrect();
        }
    };

    // Check if all correct words are selected in the correct order
    createEffect(() => {
        const correctOrder = props.card.words.filter(word => word.correct).map(item => item.word);
        if (selectedWords().length === correctOrder.length && selectedWords().every((word, index) => word === correctOrder[index])) {
            setIsComplete(true);
        }
    });

    const handleNextClick = () => {
        if (isComplete()) {
            props.onComplete();
        }
    };

    return (
        <>
            <section class="card blanks-card">

                <h4>{t('fill_in_the_blanks')}</h4>
                <h3 class="question" lang={langs().q}>{currentSentence()}</h3>

                <div class="word-options">
                    {shuffledWords().map((word) => {
                        const isSelected = selectedWords().includes(word);
                        const isCorrect = props.card.words.some((item) => item.word === word && item.correct);
                        const shakeClass = shake() === word ? 'shake' : '';
                        const className = 'word-option ' + (isSelected ? (isCorrect ? 'correct' : 'incorrect') : '') + shakeClass;

                        return (
                            <button
                                lang={langs().a}
                                onClick={() => handleWordClick(word)}
                                disabled={isSelected}
                                class={className}
                            >
                                {word}
                            </button>
                        );
                    })}
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
