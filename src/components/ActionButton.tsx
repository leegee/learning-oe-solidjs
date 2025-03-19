import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import './ActionButton.css';

interface ButtonProps {
    isCorrect: boolean | null;
    isInputPresent: boolean;
    minClickBeforeSkip?: number;
    onCheckAnswer: () => void;
    onComplete: () => void;
}

const ActionButton = ({ isCorrect, isInputPresent, minClickBeforeSkip, onCheckAnswer, onComplete }: ButtonProps) => {
    const { t } = useTranslation();
    const [clicksCounted, setClicksCounted] = useState<number>(0);

    minClickBeforeSkip = minClickBeforeSkip || 2;

    useEffect(() => {
        setClicksCounted(0);
    }, [isCorrect, isInputPresent]);

    const handleClick = () => {
        setClicksCounted((prev) => prev + 1);

        if (isCorrect === true) {
            onComplete();
        } else {
            onCheckAnswer();
        }
    };

    return (
        <>
            <button
                className={
                    isCorrect === null
                        ? 'next-button'
                        : isCorrect === false
                            ? 'try-again-button'
                            : 'next-button'
                }
                onClick={handleClick}
                disabled={!isInputPresent}
            >
                {isCorrect === null
                    ? t('next')
                    : isCorrect === true
                        ? t('correct_next')
                        : t('try_again')}
            </button>

            {clicksCounted >= minClickBeforeSkip && (
                <button className='skip-button' onClick={onComplete}>{t('skip')}</button>
            )}
        </>
    );
};

export default ActionButton;
