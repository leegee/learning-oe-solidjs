import { createSignal, createEffect } from 'solid-js';
import { t } from '../../lib/i18n';
import './ActionButton.css';

interface ButtonProps {
    isCorrect: boolean | null; // null=not yet answered
    isInputPresent: boolean;   // allows clicking
    onCheckAnswer: () => void; // first click
    onComplete: () => void;    // second click
}

const ActionButton = (props: ButtonProps) => {
    // Track if the answer has been checked or not
    const [hasChecked, setHasChecked] = createSignal(false);

    createEffect(() => {
        if (props.isCorrect === null) {
            setHasChecked(false);
        }
    });

    const handleClick = () => {
        if (!hasChecked()) {
            // First click: Check the answer
            props.onCheckAnswer();
            setHasChecked(true);
        } else {
            props.onComplete();
            setHasChecked(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (props.isCorrect !== null
            && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')
        ) {
            console.log('action button captured enter key');
            handleClick();
        }
    };

    createEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    });

    return (
        <button
            id='action-button'
            aria-label='action-button'
            class={
                props.isCorrect === null
                    ? 'next-button'
                    : props.isCorrect === true
                        ? 'correct-next-button'
                        : 'incorrect-next-button'
            }
            onClick={handleClick}
            disabled={!props.isInputPresent}
        >
            {props.isCorrect === null
                ? t('check')
                : props.isCorrect === true
                    ? t('correct_next')
                    : t('incorrect_next')}
        </button>
    );
};

export default ActionButton;
