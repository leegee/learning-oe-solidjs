import './ActionButton.css';
import { createSignal, createEffect } from 'solid-js';
import { useI18n } from '../../contexts/I18nProvider';

interface ButtonProps {
    isCorrect: boolean | null; // null=not yet answered
    isInputPresent: boolean;   // allows clicking
    onCheckAnswer: () => void; // first click
    onComplete: () => void;    // second click
}

const ActionButton = (props: ButtonProps) => {
    const { t } = useI18n();
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
