// MultipleChoice.tsx
import { For, Show } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';
import { t } from '../../i18n';

import { shuffleArray } from '../../lib/shuffle-array.ts';
import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import ActionButton from '../ActionButton.tsx';
import './MultipleChoice.css';

export type MultipleChoiceCard = Card & {
    class: 'multiple-choice';
    answers: string[];
    answer: string;
};

interface MultipleChoiceCardProps {
    card: MultipleChoiceCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const MultipleChoice = ({ card, onCorrect, onIncorrect, onComplete }: MultipleChoiceCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [selectedOption, setSelectedOption] = createSignal<string | null>(null);
    const [hasChecked, setHasChecked] = createSignal<boolean>(false);
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = createSignal<string[]>(shuffleArray(card.answers));
    const [isButtonsDisabled, setIsButtonsDisabled] = createSignal<boolean>(false);

    createEffect(() => {
        // Whenever the card changes, reset everything
        setShuffledOptions(shuffleArray(card.answers));
        setLangs(setQandALangs(card));
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
            // Move to the next round by resetting states
            setSelectedOption(null);
            setIsCorrect(null);
            setHasChecked(false);
            setIsButtonsDisabled(false);
        } else {
            // Check the answer
            setIsButtonsDisabled(true);

            if (selectedOption() === card.answer) {
                setIsCorrect(true);
                onCorrect();
            } else {
                setIsCorrect(false);
                onIncorrect();
            }

            setHasChecked(true);
        }
    };

    const getButtonClass = (hasChecked: boolean, selectedOption: string | null, option: string, isCorrect: boolean | null) => {
        if (hasChecked) {
            return selectedOption === option
                ? isCorrect ? 'correct' : 'incorrect'
                : '';
        }
        return '';
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
                            class={`multiple-choice-button ${getButtonClass(hasChecked(), selectedOption(), option, isCorrect())}`}
                            disabled={isButtonsDisabled()}
                        >
                            {option}
                        </button>
                    )}
                </For>

            </section>

            <Show when={selectedOption()}>
                <ActionButton
                    isCorrect={isCorrect()}
                    isInputPresent={selectedOption() !== null}
                    onCheckAnswer={handleCheckAnswer}
                    onComplete={onComplete}
                />
            </Show>
        </>
    );
};

export default MultipleChoice;
