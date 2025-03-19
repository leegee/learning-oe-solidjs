import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import { shuffleArray } from '../../lib/shuffle-array.ts'
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import './VocabMatch.css';

export type VocabCard = Card & {
    class: 'vocab';
    vocab: { [key: string]: string };  // Changed from array to object
};

interface VocabMatchProps {
    card: VocabCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const VocabMatch = ({ card, onCorrect, onIncorrect, onComplete }: VocabMatchProps) => {
    const [langs, setLangs] = useState<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledRightColumn, setShuffledRightColumn] = useState<string[]>([]);
    const [selectedLeftWord, setSelectedLeftWord] = useState<string | null>(null);
    const [selectedRightWord, setSelectedRightWord] = useState<string | null>(null);
    const [correctMatches, setCorrectMatches] = useState<{ [key: string]: string }>({});
    const [shakeRightWord, setShakeRightWord] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const rightColumn = Object.values(card.vocab);
        setShuffledRightColumn(shuffleArray(rightColumn));
        setLangs(setQandALangs(card));
    }, [card]);

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
        if (selectedLeftWord === leftWord) {
            setSelectedLeftWord(null);
        } else {
            setSelectedLeftWord(leftWord);
        }

        if (selectedRightWord) {
            processMatch(leftWord, selectedRightWord);
        }
    };

    const handleAnswerClick = (rightWord: string) => {
        if (selectedRightWord === rightWord) {
            setSelectedRightWord(null);
        } else {
            setSelectedRightWord(rightWord);
        }

        if (selectedLeftWord) {
            processMatch(selectedLeftWord, rightWord);
        }
    };

    useEffect(() => {
        if (Object.keys(correctMatches).length === Object.keys(card.vocab).length) {
            setIsComplete(true);
        }
    }, [correctMatches, card.vocab]);

    const handleNextClick = () => {
        if (isComplete) {
            onComplete();
        }
    };

    return (
        <>
            <section className="card vocab-match">
                <h3 lang={langs.q}>{card.question || t('match_the_words')}</h3>
                <table>
                    <tbody>
                        {Object.entries(card.vocab).map(([leftWord, correctRightWord], index) => {
                            const shuffledRightWord = shuffledRightColumn[index];

                            const isMatched = correctMatches[leftWord] === correctRightWord;
                            const isRightMatched = Object.values(correctMatches).includes(shuffledRightWord);

                            return (
                                <tr key={index}>
                                    <td>
                                        <button
                                            lang={langs.q}
                                            className={
                                                `vocab-match left-word 
                                                ${isMatched ? 'matched' : ''} 
                                                ${selectedLeftWord === leftWord ? 'selected' : ''}`
                                            }
                                            onClick={() => handleQuestionClick(leftWord)}
                                        >
                                            {leftWord}
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            lang={langs.a}
                                            className={`
                                                vocab-match right-word 
                                                ${isRightMatched ? 'matched' : ''} 
                                                ${selectedRightWord === shuffledRightWord ? 'selected' : ''} 
                                                ${shakeRightWord === shuffledRightWord ? 'shake' : ''}
                                            `}
                                            onClick={() => handleAnswerClick(shuffledRightWord)}
                                        >
                                            {shuffledRightWord}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>

            {isComplete && (
                <button className="next-button" onClick={handleNextClick}>
                    {t('next')}
                </button>
            )}
        </>
    );
};

export default VocabMatch;
