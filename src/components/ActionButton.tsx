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

const ActionButton = (props: ButtonProps) => {
    const [clicksCounted, setClicksCounted] = createSignal(0);

    props.minClickBeforeSkip ||= 4;

    console.log("Rendering ActionButton, isInputPresent:", props.isInputPresent);

    // Reset the clicksCounted signal when isCorrect changes
    createEffect(() => {
        setClicksCounted(0);
    });

    const handleClick = () => {
        console.log('actionbutton handleclick enter', props.isCorrect);
        setClicksCounted((prev) => prev + 1);

        if (props.isCorrect === true) {
            console.log('actionbutton handleclick isCorrect, onComplete');
            props.onComplete();
        } else {
            console.log('actionbutton handleclick oncheckanswer');
            props.onCheckAnswer();
        }
    };

    return (
        <>
            <button
                class={
                    props.isCorrect === null
                        ? 'next-button'
                        : props.isCorrect === false
                            ? 'try-again-button'
                            : 'next-button'
                }
                onClick={handleClick}
                disabled={!props.isInputPresent}
            >
                {props.isCorrect === null
                    ? t('check')
                    : props.isCorrect === true
                        ? t('correct_next')
                        : t('try_again')}
            </button>

            {!props.isCorrect && clicksCounted() >= (props.minClickBeforeSkip) && (
                <button class='skip-button' onClick={props.onComplete}>{t('skip')}</button>
            )}
        </>
    );
};

export default ActionButton;
