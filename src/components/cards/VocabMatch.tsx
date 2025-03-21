import { createSignal, createEffect, For, Show } from 'solid-js';
import { t } from '../../i18n';
import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type IBaseCard } from './BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import appConfig from '../../config.ts';
import './VocabMatch.css';

export interface IVocabMatchCard extends IBaseCard {
    class: 'vocab';
    vocab: { [key: string]: string };
};

interface ITableRow {
    leftWord: string;
    rightWord: string;
    shuffledRightWord: string;
    isLeftMatched: boolean;
    isRightMatched: boolean;
    isLeftDisabled: boolean;
    isRightDisabled: boolean;
    shakeIt: boolean;
    shakeRight: boolean;
}

interface IVocabMatchCardProps {
    card: IVocabMatchCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const VocabMatchCardComponent = ({ card, onCorrect, onIncorrect, onComplete }: IVocabMatchCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledRightColumn, setShuffledRightColumn] = createSignal<string[]>([]);
    const [tableData, setTableData] = createSignal<ITableRow[]>([]);
    const [isComplete, setIsComplete] = createSignal(false);

    const [selectedLeft, setSelectedLeft] = createSignal<string | null>(null);
    const [selectedRight, setSelectedRight] = createSignal<string | null>(null);

    createEffect(() => {
        setLangs(setQandALangs(card));
        const rightColumn = Object.values(card.vocab);
        setShuffledRightColumn(shuffleArray(rightColumn));

        setTableData(Object.keys(card.vocab).map((leftWord, index) => {
            const rightWord = card.vocab[leftWord];
            return {
                leftWord,
                rightWord,
                shuffledRightWord: shuffledRightColumn()[index],
                isLeftMatched: false,
                isRightMatched: false,
                isLeftDisabled: false,
                isRightDisabled: false,
                shakeIt: false,
                shakeRight: false,
            };
        }));
    });

    const handleLeftWordClicked = (leftWord: string) => {
        setSelectedLeft(prev => (prev === leftWord ? null : leftWord));
    };

    const handleRightWordClicked = (shuffledRightWord: string) => {
        setSelectedRight(prev => (prev === shuffledRightWord ? null : shuffledRightWord));
    };

    // Word-matching logic
    createEffect(() => {
        if (!selectedLeft() || !selectedRight()) return;

        const leftWord = selectedLeft()!;
        const rightWord = selectedRight()!;

        const correctMatch = card.vocab[leftWord] === rightWord;

        if (correctMatch) {
            setTableData(prevData =>
                prevData.map(row => {
                    const isCorrectLeft = row.leftWord === leftWord && row.rightWord === rightWord;
                    const isCorrectRight = row.shuffledRightWord === rightWord;

                    if (isCorrectLeft || isCorrectRight) {
                        return {
                            ...row,
                            isLeftMatched: isCorrectLeft ? true : row.isLeftMatched,
                            isRightMatched: isCorrectRight ? true : row.isRightMatched,
                            isLeftDisabled: isCorrectLeft ? true : row.isLeftDisabled,
                            isRightDisabled: isCorrectRight ? true : row.isRightDisabled,
                        };
                    }
                    return row;
                })
            );
            setSelectedLeft(null);
            setSelectedRight(null);
            onCorrect();
        } else {
            // Apply shake effect
            setTableData(prevData =>
                prevData.map(row =>
                    row.leftWord === leftWord || row.shuffledRightWord === rightWord
                        ? { ...row, shakeIt: row.leftWord === leftWord, shakeRight: row.shuffledRightWord === rightWord }
                        : row
                )
            );

            onIncorrect();

            setTimeout(() => {
                setTableData(prevData =>
                    prevData.map(row =>
                        row.shakeIt || row.shakeRight ? { ...row, shakeIt: false, shakeRight: false } : row
                    )
                );
            }, appConfig.animationShakeMs);

            setSelectedLeft(null);
            setSelectedRight(null);
        }
    });

    // Check if all matches are completed
    createEffect(() => {
        if (tableData().every(row => row.isLeftMatched && row.isRightMatched) && !isComplete()) {
            setIsComplete(true);
            // onComplete();
        }
    });

    return (
        <>
            <section class="card vocab-match">
                <h3 lang={langs().q}>{card.question || t('match_the_words')}</h3>
                <table>
                    <tbody>
                        <For each={tableData()}>
                            {(row) => (
                                <tr>
                                    <td>
                                        <button
                                            lang={langs().q}
                                            class={`vocab-match left-word ${row.isLeftMatched ? 'matched' : ''} ${selectedLeft() === row.leftWord ? 'selected' : ''} ${row.shakeIt ? 'shake' : ''}`}
                                            onClick={() => handleLeftWordClicked(row.leftWord)}
                                            disabled={row.isLeftDisabled}
                                        >
                                            {row.leftWord}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            lang={langs().a}
                                            class={`vocab-match right-word ${row.isRightMatched ? 'matched' : ''} ${selectedRight() === row.shuffledRightWord ? 'selected' : ''} ${row.shakeRight ? 'shake' : ''}`}
                                            onClick={() => handleRightWordClicked(row.shuffledRightWord)}
                                            disabled={row.isRightDisabled}
                                        >
                                            {row.shuffledRightWord}
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </For>
                    </tbody>
                </table>
            </section>

            <Show when={isComplete()} fallback=''>
                <button class="next-button" onClick={onComplete}>
                    {t('next')}
                </button>

            </Show>
        </>
    );
};

export default VocabMatchCardComponent;
