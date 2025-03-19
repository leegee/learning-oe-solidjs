import { createSignal, createEffect, For } from 'solid-js';
import { t } from '../../i18n';
import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import './VocabMatch.css';

export type VocabCard = Card & {
    class: 'vocab';
    vocab: { [key: string]: string }; // Changed from array to object
};

interface VocabMatchProps {
    card: VocabCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const VocabMatch = ({ card, onCorrect, onIncorrect, onComplete }: VocabMatchProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledRightColumn, setShuffledRightColumn] = createSignal<string[]>([]);
    const [selectedLeftWord, setSelectedLeftWord] = createSignal<string | null>(null);
    const [selectedRightWord, setSelectedRightWord] = createSignal<string | null>(null);
    const [correctMatches, setCorrectMatches] = createSignal<{ [key: string]: string }>({});
    const [shakeRightWord, setShakeRightWord] = createSignal<string | null>(null);
    const [isComplete, setIsComplete] = createSignal(false);

    createEffect(() => {
        const rightColumn = Object.values(card.vocab);
        setShuffledRightColumn(shuffleArray(rightColumn));
        setLangs(setQandALangs(card));
    });

    const processMatch = (leftWord: string, rightWord: string) => {
        if (card.vocab[leftWord] === rightWord) {
            setCorrectMatches((prev) => ({ ...prev, [leftWord]: rightWord }));
            onCorrect();
        } else {
            setShakeRightWord(rightWord);
            setTimeout(() => setShakeRightWord(null), 1000);
            onIncorrect();
        }

        // Reset selections after processing
        setSelectedLeftWord(null);
        setSelectedRightWord(null);
    };

    const handleQuestionClick = (leftWord: string) => {
        if (selectedLeftWord() === leftWord) {
            setSelectedLeftWord(null);
        } else {
            setSelectedLeftWord(leftWord);
        }

        if (selectedRightWord()) {
            processMatch(leftWord, selectedRightWord()!);
        }
    };

    const handleAnswerClick = (rightWord: string) => {
        if (selectedRightWord() === rightWord) {
            setSelectedRightWord(null);
        } else {
            setSelectedRightWord(rightWord);
        }

        if (selectedLeftWord()) {
            processMatch(selectedLeftWord()!, rightWord);
        }
    };

    createEffect(() => {
        if (Object.keys(correctMatches()).length === Object.keys(card.vocab).length) {
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
            <section class="card vocab-match">
                <h3 lang={langs().q}>{card.question || t('match_the_words')}</h3>
                <table>
                    <tbody>
                        <For each={Object.entries(card.vocab)}>
                            {([leftWord, correctRightWord], index) => {
                                const shuffledRightWord = shuffledRightColumn()[index()];

                                const isMatched = correctMatches()[leftWord] === correctRightWord;
                                const isRightMatched = Object.values(correctMatches()).includes(shuffledRightWord);

                                return (
                                    <tr>
                                        <td>
                                            <button
                                                lang={langs().q}
                                                class={`vocab-match left-word ${isMatched ? 'matched' : ''} ${selectedLeftWord() === leftWord ? 'selected' : ''}`}
                                                onClick={() => handleQuestionClick(leftWord)}
                                            >
                                                {leftWord}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                lang={langs().a}
                                                class={`vocab-match right-word ${isRightMatched ? 'matched' : ''} ${selectedRightWord() === shuffledRightWord ? 'selected' : ''} ${shakeRightWord() === shuffledRightWord ? 'shake' : ''}`}
                                                onClick={() => handleAnswerClick(shuffledRightWord)}
                                            >
                                                {shuffledRightWord}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }}
                        </For>
                    </tbody>
                </table>
            </section>

            {isComplete() && (
                <button class="next-button" onClick={handleNextClick}>
                    {t('next')}
                </button>
            )}
        </>
    );
};

export default VocabMatch;
