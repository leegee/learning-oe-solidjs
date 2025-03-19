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

const MultipleChoiceComponent = ({ card, onCorrect, onIncorrect, onComplete }: IMultipleChoiceCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [selectedOption, setSelectedOption] = createSignal<string | null>(null);
    const [hasChecked, setHasChecked] = createSignal<boolean>(false);
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = createSignal<string[]>(shuffleArray(card.answers));
    const [isButtonsDisabled, setIsButtonsDisabled] = createSignal<boolean>(false);

    createEffect(() => {
        console.log("Card changed, resetting state");
        setShuffledOptions(shuffleArray(card.answers));
        setLangs(setQandALangs(card));
        setSelectedOption(null);
        setIsCorrect(null);
        setHasChecked(false);
        setIsButtonsDisabled(false);
    });

    const handleOptionClick = (option: string) => {
        if (!isButtonsDisabled()) {
            console.log(`Selected option: ${option}`);
            setSelectedOption(option);
        }
    };

    const handleCheckAnswer = () => {
        console.log("Checking answer...");
        if (hasChecked()) {
            console.log("Already checked, resetting state");
            setSelectedOption(null);
            setIsCorrect(null);
            setHasChecked(false);
            setIsButtonsDisabled(false);
        } else {
            console.log(`Selected option: ${selectedOption()}, Correct answer: ${card.answer}`);
            setIsButtonsDisabled(true);

            if (selectedOption() === card.answer) {
                console.log("Correct answer!");
                setIsCorrect(true);
                onCorrect();
            } else {
                console.log("Incorrect answer.");
                setIsCorrect(false);
                onIncorrect();
            }

            setHasChecked(true);
        }
    };

    return (
        <>
            <section class='card multiple-choice'>
                <h4 lang={langs().q}>{t('in_lang_how_do_you_say', { lang: t(langs().a) })}</h4>
                <h3 class="question" lang={langs().q}>{card.question}</h3>

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
                onComplete={onComplete}
            />
        </>
    );
};

export default MultipleChoiceComponent;