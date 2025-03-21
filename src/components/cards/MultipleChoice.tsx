import { For } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { t } from '../../i18n';

import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type IBaseCard } from './BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import ActionButton from '../ActionButton.tsx';
import './MultipleChoice.css';

export interface IMultipleChoiceCard extends IBaseCard {
    class: 'multiple-choice';
    answers: string[];
    answer: string;
};

interface IMultipleChoiceCardProps {
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
    const [isButtonsDisabled, setIsButtonsDisabled] = createSignal<boolean>(false);

    createEffect(() => {
        console.log('Card changed:', JSON.stringify(props.card, null, 4));
    });

    createEffect(() => {
        setShuffledOptions(shuffleArray(props.card.answers));
        setLangs(setQandALangs(props.card));
        setSelectedOption(null);
        setIsCorrect(null);
        setHasChecked(false);
        setIsButtonsDisabled(false);
    });

    const handleOptionClick = (option: string) => {
        if (!isButtonsDisabled()) {
            setSelectedOption(option);
        }
    };

    const handleCheckAnswer = () => {
        if (hasChecked()) {
            setSelectedOption(null);
            setIsCorrect(null);
            setHasChecked(false);
            setIsButtonsDisabled(false);
        } else {
            setIsButtonsDisabled(true);

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
                <h4 lang={langs().q}>{t('in_lang_how_do_you_say', { lang: t(langs().a) })}</h4>
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
                            disabled={isButtonsDisabled()}
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