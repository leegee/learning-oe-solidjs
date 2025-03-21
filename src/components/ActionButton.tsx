import { t } from '../i18n';
import './ActionButton.css';

interface ButtonProps {
    isCorrect: boolean | null;
    isInputPresent: boolean;
    onCheckAnswer: () => void;
    onComplete: () => void;
}

const ActionButton = (props: ButtonProps) => {
    const handleClick = () => {
        if (props.isCorrect === true) {
            console.log('actionbutton handleclick isCorrect, onComplete');
            props.onComplete();
        } else {
            console.log('actionbutton handleclick oncheckanswer');
            props.onCheckAnswer();
        }
    };

    return (
        <button
            class={
                props.isCorrect === null
                    ? 'next-button'
                    : props.isCorrect === true
                        ? 'correct-next-button'
                        : 'try-again-button'
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
    );
};

export default ActionButton;
