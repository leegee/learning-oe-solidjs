import './ActionButton.css';
import { createSignal, createEffect, onMount, onCleanup } from 'solid-js';
import { useI18n } from '../../contexts/I18nProvider';

interface ButtonProps {
    isCorrect: boolean | null; // null=not yet answered
    isInputPresent: boolean;   // allows clicking
    onCheckAnswer: () => void; // first click
    onComplete: () => void;    // second click
    onReset?: () => void;      // Last question, answer wrong 
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
        console.log('Action button click, props.isCorrect =', props.isCorrect);
        if (!hasChecked()) {
            // First click: Check the answer
            console.log('AB first click: not yet checked, checking now');
            props.onCheckAnswer();
            setHasChecked(true);
        }
        else if (props.isCorrect === false && props.onReset) {
            console.log('AB click: reset');
            setHasChecked(false);
            props.onReset();
        }
        else {
            console.log('AB other click: has checked, calling complete');
            props.onComplete();
            // setHasChecked(false);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (!props.isInputPresent) return;
        if (props.isCorrect !== null
            && (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar')
        ) {
            handleClick();
        }
    };

    onMount(() => document.addEventListener('keydown', handleKeyDown));
    onCleanup(() => document.removeEventListener('keydown', handleKeyDown));

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
