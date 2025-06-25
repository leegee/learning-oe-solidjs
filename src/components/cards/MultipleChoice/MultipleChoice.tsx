import { createResource, For, Show } from 'solid-js';
import { createSignal, createEffect } from 'solid-js';

import { shuffleArray } from '../../../lib/shuffle-array';
import { setQandALangs } from '../../../lib/set-q-and-a-langs';
import { type IBaseCard } from '../BaseCard.type';
import ActionButton from '../../ActionButton';
import './MultipleChoice.css';
import { useI18n } from '../../../contexts/I18nProvider';
import { LanguageCode, speakLetter } from '../../../lib/speak-letters';

export interface IMultipleChoiceCard extends IBaseCard {
    class: 'multiple-choice';
    answers: string[]; // TODO BooleanWord[] would be better
    answer: string;
};

export const defaultCard: IMultipleChoiceCard = {
    class: 'multiple-choice',
    question: 'A Question',
    qlang: 'default',
    answers: ['An answer', 'Another answer'],
    answer: 'An answer'
};

export interface IMultipleChoiceCardProps {
    card: IMultipleChoiceCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const MultipleChoiceComponent = (props: IMultipleChoiceCardProps) => {
    const { t } = useI18n();
    const [langs] = createResource(() => setQandALangs(props.card));
    const [selectedOption, setSelectedOption] = createSignal<string | null>(null);
    const [hasChecked, setHasChecked] = createSignal<boolean>(false);
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = createSignal<string[]>(shuffleArray(props.card.answers));
    const [areButtonsDisabled, setAreButtonsDisabled] = createSignal<boolean>(false);

    createEffect(() => {
        setShuffledOptions(shuffleArray(props.card.answers));
        setHasChecked(false);
        setSelectedOption(null);
        setIsCorrect(null);
        setAreButtonsDisabled(false);
    });

    const handleOptionClick = (option: string) => {
        if (!areButtonsDisabled()) {
            setSelectedOption(option);
            if (option.length === 1) {
                speakLetter(option, langs()!.a as LanguageCode);
            }
        }
    };

    const handleReset = () => {
        setSelectedOption(null);
        setIsCorrect(null);
        setHasChecked(false);
        setAreButtonsDisabled(false);
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
        <Show when={langs()} fallback={<p>Loading...</p>}>
            <section class='card multiple-choice'>
                {langs()!.q !== langs()!.q &&
                    <h4 lang={langs()!.q}>
                        {t('in_lang_how_do_you_say', { lang: t(langs()!.a) })}
                    </h4>
                }
                <h3 class="question" lang={langs()!.q}>{props.card.question}</h3>

                <div class='options'>
                    <For each={shuffledOptions()}>
                        {(option) => (
                            <button
                                lang={langs()!.a}
                                onClick={() => handleOptionClick(option)}
                                class={`multiple-choice-button ${selectedOption() === option ? 'selected' : ''} ${hasChecked() && selectedOption() === option
                                    ? (isCorrect() ? 'correct' : 'incorrect')
                                    : ''
                                    }`}
                                disabled={areButtonsDisabled() ? true : undefined}
                                aria-label={hasChecked() ? (isCorrect() ? `${option} (${t('correct')})` : `${option} (${t('incorrect')})`) : `${t('select')} ${option}`}
                            >
                                {option}
                            </button>
                        )}
                    </For>
                </div>
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={selectedOption() !== null}
                onCheckAnswer={handleCheckAnswer}
                onComplete={props.onComplete}
                onReset={handleReset}
            />
        </Show>
    );
};

export default MultipleChoiceComponent;