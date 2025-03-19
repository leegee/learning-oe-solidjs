// BlanksCard.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import './BlanksCard.css';

export type BlanksCard = Card & {
    class: 'blanks';
    question: string;
    words: { word: string; correct: boolean }[]; // Array of words with a correct boolean flag
};

interface BlanksCardProps {
    card: BlanksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const BlanksCard = ({ card, onCorrect, onIncorrect, onComplete }: BlanksCardProps) => {
    const [langs, setLangs] = useState<setQandALangsReturnType>(setQandALangs(card));
    const [shuffledWords, setShuffledWords] = useState<string[]>([]);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [currentSentence, setCurrentSentence] = useState<string>(card.question);
    const [shake, setShake] = useState<string | null>(null);

    const { t } = useTranslation();

    useEffect(() => {
        setShuffledWords(shuffleArray(card.words.map(word => word.word)));
        setLangs(setQandALangs(card));
    }, [card]);

    const handleWordClick = (word: string) => {
        const firstBlankIndex = currentSentence.indexOf('__');

        if (firstBlankIndex === -1) {
            return;
        }

        const isCorrect = card.words.find((item) => item.word === word && item.correct);

        if (isCorrect) {
            const expectedWord = card.words.filter(word => word.correct)[selectedWords.length].word;

            if (word === expectedWord) {
                onCorrect();
                setSelectedWords((prev) => [...prev, word]);
                let updatedSentence = currentSentence;
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
    useEffect(() => {
        const correctOrder = card.words.filter(word => word.correct).map(item => item.word);
        if (selectedWords.length === correctOrder.length && selectedWords.every((word, index) => word === correctOrder[index])) {
            setIsComplete(true);
        }
    }, [selectedWords, card]);

    const handleNextClick = () => {
        if (isComplete) {
            onComplete();
        }
    };

    return (
        <>
            <section className="card blanks-card">

                <h4>{t('fill_in_the_blanks')}</h4>
                <h3 className="question" lang={langs.q}>{currentSentence}</h3>

                <div className="word-options">
                    {shuffledWords.map((word, index) => {
                        const isSelected = selectedWords.includes(word);
                        const isCorrect = card.words.find((item) => item.word === word && item.correct);

                        return (
                            <button
                                key={index}
                                lang={langs.a}
                                onClick={() => handleWordClick(word)}
                                disabled={isSelected}
                                className={
                                    `word-option 
                                    ${isSelected ? isCorrect ? 'correct' : 'incorrect' : ''}
                                    ${shake === word ? 'shake' : ''}
                                `}
                            >
                                {word}
                            </button>
                        );
                    })}
                </div>
            </section>

            {isComplete && (
                <button className="next-button" onClick={handleNextClick}>
                    {t('next')}
                </button>
            )}
        </>
    );
};

export default BlanksCard;
