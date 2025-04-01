import { For } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';

// import { t } from '../../../i18n';
import { shuffleArray } from '../../../lib/shuffle-array';
import { setQandALangs, setQandALangsReturnType } from '../../../lib/set-q-and-a-langs';
import { type IBaseCard } from '../BaseCard.type';
import ActionButton from '../../ActionButton';
import './MultipleChoice.css';

export interface IMultipleChoiceCard extends IBaseCard {
    class: 'multiple-choice';
    answers: string[];
    answer: string;
};

export interface IMultipleChoiceCardProps {
    card: IMultipleChoiceCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const MultipleChoiceComponent = (props: IMultipleChoiceCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(props.card));
    const [selectedOption, setSelectedOption] = createSignal<string | null>(null);
    const [hasChecked, setHasChecked] = createSignal<boolean>(false);
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = createSignal<string[]>(shuffleArray(props.card.answers));
    const [areButtonsDisabled, setAreButtonsDisabled] = createSignal<boolean>(false);

    createEffect(() => {
        setShuffledOptions(shuffleArray(props.card.answers));
        setLangs(setQandALangs(props.card));
        setHasChecked(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setAreButtonsDisabled(false);
    });

    const handleOptionClick = (option: string) => {
        if (!areButtonsDisabled()) {
            setSelectedOption(option);
        }
    };

    const handleCheckAnswer = () => {
        if (hasChecked()) {
            setSelectedOption(null);
            setIsCorrect(null);
            setHasChecked(false);
            setAreButtonsDisabled(false);
        } else {
            setAreButtonsDisabled(true);

            if (selectedOption() === props.card.answer) {
                setIsCorrect(true);
                props.onCorrect();
            } else {
                setIsCorrect(false);
                props.onIncorrect();
            }

            setHasChecked(true);
        }
    };

    return (
        <>
            <section class='card multiple-choice'>
                {/* <h4 lang={langs().q}>{t('in_lang_how_do_you_say', { lang: t(langs().a) })}</h4> */}
                <h3 class="question" lang={langs().q}>{props.card.question}</h3>

                <For each={shuffledOptions()}>
                    {(option) => (
                        <button
                            lang={langs().a}
                            onClick={() => handleOptionClick(option)}
                            class={`multiple-choice-button ${selectedOption() === option ? 'selected' : ''} ${hasChecked() && selectedOption() === option
                                ? (isCorrect() ? 'correct' : 'incorrect')
                                : ''
                                }`}
                            disabled={areButtonsDisabled() ? true : undefined}
                        >
                            {option}
                        </button>
                    )}
                </For>
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={selectedOption() !== null}
                onCheckAnswer={handleCheckAnswer}
                onComplete={props.onComplete}
            />
        </>
    );
};

export default MultipleChoiceComponent;