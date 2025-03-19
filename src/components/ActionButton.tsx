import { createSignal, createEffect } from 'solid-js';
import { t } from '../i18n';
import './ActionButton.css';

interface ButtonProps {
    isCorrect: boolean | null;
    isInputPresent: boolean;
    minClickBeforeSkip?: number;
    onCheckAnswer: () => void;
    onComplete: () => void;
}

const ActionButton = ({ isCorrect, isInputPresent, minClickBeforeSkip, onCheckAnswer, onComplete }: ButtonProps) => {
    const [clicksCounted, setClicksCounted] = createSignal(0);

    minClickBeforeSkip = minClickBeforeSkip || 2;

    createEffect(() => {
        setClicksCounted(0);
    });

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
                class={
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

            {clicksCounted() >= minClickBeforeSkip && (
                <button class='skip-button' onClick={onComplete}>{t('skip')}</button>
            )}
        </>
    );
};

export default ActionButton;
