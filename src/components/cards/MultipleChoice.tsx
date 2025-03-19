// MultipleChoice.tsx
import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";

import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import ActionButton from '../ActionButton.tsx';
import './MultipleChoice.css';

export type MultipleChoiceCard = Card & {
    class: 'multiple-choice';
    answers: string[];
    answer: string;
};

interface MultipleChoiceCardProps {
    card: MultipleChoiceCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const MultipleChoice = ({ card, onCorrect, onIncorrect, onComplete }: MultipleChoiceCardProps) => {
    const [langs, setLangs] = useState<setQandALangsReturnType>(setQandALangs(card));
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [hasChecked, setHasChecked] = useState<boolean>(false);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [isButtonsDisabled, setIsButtonsDisabled] = useState<boolean>(false);
    const { t } = useTranslation();

    useEffect(() => {
        setShuffledOptions(shuffleArray(card.answers));
        setLangs(setQandALangs(card));
        setSelectedOption(null);
        setIsCorrect(null);
        setHasChecked(false);
        setIsButtonsDisabled(false);
    }, [card]);

    const handleOptionClick = (option: string) => {
        if (!isButtonsDisabled) {
            setSelectedOption(option);
        }
    };

    const handleCheckAnswer = () => {
        if (hasChecked) {
            // Move to the next round by resetting states
            setSelectedOption(null);
            setIsCorrect(null);
            setHasChecked(false);
            setIsButtonsDisabled(false);
        } else {
            // Check the answer
            setIsButtonsDisabled(true);

            if (selectedOption === card.answer) {
                setIsCorrect(true);
                onCorrect();
            } else {
                setIsCorrect(false);
                onIncorrect();
            }

            setHasChecked(true);
        }
    };

    return (
        <>
            <section className='card multiple-choice'>
                <h4 lang={langs.q}>{t('in_lang_how_do_you_say', { lang: t(langs.a) })}</h4>
                <h3 className="question" lang={langs.q}>{card.question}</h3>

                {shuffledOptions.map((option, index) => (
                    <button
                        lang={langs.a}
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={`multiple-choice-button 
                            ${hasChecked && selectedOption === option ?
                                (isCorrect && selectedOption === option ? 'correct' : 'incorrect')
                                : ''}`}
                        disabled={isButtonsDisabled}
                    >
                        {option}
                    </button>
                ))}
            </section>

            {selectedOption && (
                <ActionButton
                    isCorrect={isCorrect}
                    isInputPresent={selectedOption !== null}
                    onCheckAnswer={handleCheckAnswer}
                    onComplete={onComplete}
                />
            )}
        </>
    );
};

export default MultipleChoice;
