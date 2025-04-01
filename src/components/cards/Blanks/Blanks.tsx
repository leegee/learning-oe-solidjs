import { createSignal, createEffect } from 'solid-js';
import { t } from '../../../i18n';

import { shuffleArray } from '../../../lib/shuffle-array.ts';
import { type IBaseCard } from '../BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../../lib/set-q-and-a-langs.ts';
import './Blanks.css';

export interface IBlanksCard extends IBaseCard {
    class: 'blanks';
    question: string;
    words: Record<string, boolean>[]; // New structure
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

    // Extract words from new structure
    const getWords = () => props.card.words.map(wordObj => Object.keys(wordObj)[0]);
    const getCorrectWords = () => props.card.words.filter(wordObj => Object.values(wordObj)[0]).map(wordObj => Object.keys(wordObj)[0]);

    createEffect(() => {
        setShuffledWords(shuffleArray(getWords()));
        setLangs(setQandALangs(props.card));
    });

    const handleWordClick = (word: string) => {
        const firstBlankIndex = currentSentence().indexOf('__');
        if (firstBlankIndex === -1) return;

        const isCorrect = props.card.words.some(wordObj => wordObj[word] === true);

        if (isCorrect) {
            const expectedWord = getCorrectWords()[selectedWords().length];
            if (word === expectedWord) {
                props.onCorrect();
                setSelectedWords(prev => [...prev, word]);
                setCurrentSentence(prev => prev.replace(/__+/, word));
            } else {
                setShake(word);
                setTimeout(() => setShake(null), 1000);
                props.onIncorrect();
            }
        } else {
            setShake(word);
            setTimeout(() => setShake(null), 1000);
            props.onIncorrect();
        }
    };

    createEffect(() => {
        if (selectedWords().length === getCorrectWords().length &&
            selectedWords().every((word, index) => word === getCorrectWords()[index])) {
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
                        const isCorrect = props.card.words.some(wordObj => wordObj[word] === true);
                        const shakeClass = shake() === word ? 'shake' : '';
                        const className = `word-option ${isSelected ? (isCorrect ? 'correct' : 'incorrect') : ''} ${shakeClass}`;

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
