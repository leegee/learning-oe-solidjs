import { createSignal, createEffect } from 'solid-js';
import { t } from '../../i18n';
import './ActionButton.css';

interface ButtonProps {
    isCorrect: boolean | null;
    isInputPresent: boolean;
    onCheckAnswer: () => void;
    onComplete: () => void;
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
            setHasChecked(true);  // Mark the answer as checked
        } else {
            props.onComplete();
            setHasChecked(false);
        }
    };

    return (
        <button
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
