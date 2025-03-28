import { createSignal, createEffect, createMemo } from 'solid-js';
import { t } from '../../../i18n.ts';

import { type IBaseCard } from '../BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../../lib/set-q-and-a-langs.ts';
import ActionButton from '../../ActionButton.tsx';
import LetterButtons from '../../LetterButtons.tsx';
import './Writing.css';

export interface IWritingCard extends IBaseCard {
    class: 'writing';
    answer: string;
};

export interface IWritingCardProps {
    card: IWritingCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\W+/g, '').replace(/\s+/g, ' ');
};

const WritingCardComponent = (props: IWritingCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(props.card));
    const [userInput, setUserInput] = createSignal<string>('');
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);

    let inputRef: HTMLTextAreaElement | null = null;

    const normalizedAnswer = createMemo(() => normalizeText(props.card.answer));

    createEffect(() => {
        const newLangs = setQandALangs(props.card);
        setLangs(newLangs);
    });

    const setTheUserInput = (text: string) => {
        setIsCorrect(null);
        setUserInput(text);
    }

    const handleLetterButtonClick = (letter: string) => {
        setTheUserInput(userInput() + letter);
        if (inputRef) {
            inputRef.focus();
        }
    };

    const handleCheckAnswer = () => {
        const normalizedUserInput = normalizeText(userInput());
        if (normalizedUserInput === normalizedAnswer()) {
            setIsCorrect(true);
            props.onCorrect();
        } else {
            setIsCorrect(false);
            props.onIncorrect();
        }
    };

    const next = () => {
        setIsCorrect(null)
        setTheUserInput('');
        props.onComplete();
    };

    return (
        <>
            <section class='card writing-card'>
                {/*<h4>{t('translate_to_lang', { lang: t(langs.a) })}</h4> */}
                <h3 class="question" lang={langs().q}>{props.card.question}</h3>

                <textarea
                    id='writing-input'
                    class='answer'
                    placeholder={t('type_in') + ' ' + t(langs().a) + '...'}
                    ref={el => inputRef = el}
                    lang={langs().a}
                    value={userInput()}
                    autofocus={true}
                    onInput={(e) => setTheUserInput(e.target.value)}
                    aria-label={t('enter_answer')}
                />

                {langs().a === 'ang' && (
                    <LetterButtons
                        lang={langs().a}
                        onSelect={handleLetterButtonClick}
                    />
                )}
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={userInput().length > 0}
                onCheckAnswer={handleCheckAnswer}
                onComplete={next}
            />
        </>
    );
};

export default WritingCardComponent;
