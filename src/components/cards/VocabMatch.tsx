import { createSignal, createEffect, For } from 'solid-js';
import { t } from '../../i18n';
import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import appConfig from '../../config.ts';
import './VocabMatch.css';

export type VocabCard = Card & {
    class: 'vocab';
    vocab: { [key: string]: string };
};

interface TableRow {
    leftWord: string;
    rightWord: string;
    shuffledRightWord: string;
    isMatched: boolean;
    isSelectedLeft: boolean;
    isSelectedRight: boolean;
    isDisabled: boolean;
    shakeLeft: boolean;  // Track shake state for left word
    shakeRight: boolean; // Track shake state for right word
}

interface VocabMatchProps {
    card: VocabCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const VocabMatch = ({ card, onCorrect, onIncorrect, onComplete }: VocabMatchProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledRightColumn, setShuffledRightColumn] = createSignal<string[]>([]); // Initialize as empty array
    const [tableData, setTableData] = createSignal<TableRow[]>([]); // Initialize table data
    const [isComplete, setIsComplete] = createSignal(false); // Track if matching is complete

    // Shuffle right column when card.vocab changes
    createEffect(() => {
        setLangs(setQandALangs(card));
        const rightColumn = Object.values(card.vocab);
        setShuffledRightColumn(shuffleArray(rightColumn)); // Shuffle once vocab is available

        // Update tableData when vocab changes
        setTableData(Object.keys(card.vocab).map((leftWord, index) => {
            const rightWord = card.vocab[leftWord];
            const shuffledRightWord = shuffledRightColumn()[index];
            return {
                leftWord,
                rightWord,
                shuffledRightWord,
                isMatched: false,
                isSelectedLeft: false,
                isSelectedRight: false,
                isDisabled: false,
                shakeLeft: false,
                shakeRight: false,
            };
        }));
    });

    const handleLeftWordClicked = (leftWord: string) => {
        setTableData(prevData => prevData.map(row => {
            if (row.leftWord === leftWord && !row.isMatched) {
                // Toggle selection if not matched
                return { ...row, isSelectedLeft: !row.isSelectedLeft };
            }
            return row;
        }));
    };

    const handleRightWordClicked = (shuffledRightWord: string) => {
        setTableData(prevData => prevData.map(row => {
            if (row.shuffledRightWord === shuffledRightWord && !row.isMatched) {
                // Toggle selection if not matched
                return { ...row, isSelectedRight: !row.isSelectedRight };
            }
            return row;
        }));
    };

    // Word-matching logic
    createEffect(() => {
        const selectedLeftWord = tableData().find(row => row.isSelectedLeft)?.leftWord;
        const selectedRightWord = tableData().find(row => row.isSelectedRight)?.shuffledRightWord;

        if (selectedLeftWord && selectedRightWord) {
            const correctMatch = card.vocab[selectedLeftWord] === selectedRightWord;
            if (correctMatch) {
                setTableData(prevData => prevData.map(row =>
                    row.leftWord === selectedLeftWord && row.shuffledRightWord === selectedRightWord
                        ? { ...row, isMatched: true, isSelectedLeft: false, isSelectedRight: false, isDisabled: true, shakeLeft: false, shakeRight: false }
                        : row
                ));
                onCorrect();
            } else {
                // Apply shake class when mismatch occurs
                setTableData(prevData => prevData.map(row =>
                    row.leftWord === selectedLeftWord || row.shuffledRightWord === selectedRightWord
                        ? { ...row, isSelectedLeft: false, isSelectedRight: false, shakeLeft: row.leftWord === selectedLeftWord, shakeRight: row.shuffledRightWord === selectedRightWord }
                        : row
                ));
                onIncorrect();

                setTimeout(() => {
                    setTableData(prevData => prevData.map(row =>
                        row.shakeLeft || row.shakeRight
                            ? { ...row, shakeLeft: false, shakeRight: false }
                            : row
                    ));
                }, appConfig.animationShakeMs);
            }
        }
    });

    // Check for completion
    createEffect(() => {
        const isCompleted = tableData().every(row => row.isMatched);
        if (isCompleted && !isComplete()) {
            setIsComplete(true); // Only call onComplete once
            onComplete();
        }
    });

    return (
        <>
            <section class="card vocab-match">
                <h3 lang={langs().q}>{card.question || t('match_the_words')}</h3>
                <table>
                    <tbody>
                        <For each={tableData()}>
                            {(row) => {
                                return (
                                    <tr>
                                        <td>
                                            <button
                                                lang={langs().q}
                                                class={`vocab-match left-word ${row.isMatched ? 'matched' : ''} ${row.isSelectedLeft ? 'selected' : ''} ${row.shakeLeft ? 'shake' : ''}`}
                                                onClick={() => handleLeftWordClicked(row.leftWord)}
                                                disabled={row.isMatched}
                                            >
                                                {row.leftWord}
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                lang={langs().a}
                                                class={`vocab-match right-word ${row.isMatched ? 'matched' : ''} ${row.isSelectedRight ? 'selected' : ''} ${row.shakeRight ? 'shake' : ''}`}
                                                onClick={() => handleRightWordClicked(row.shuffledRightWord)}
                                                disabled={row.isMatched}
                                            >
                                                {row.shuffledRightWord}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            }}
                        </For>
                    </tbody>
                </table>
            </section>
        </>
    );
};

export default VocabMatch;
