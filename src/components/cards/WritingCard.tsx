import { createSignal, createEffect, createMemo } from 'solid-js';
import { t } from '../../i18n';

import { type IBaseCard } from './BaseCard.type.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import ActionButton from '../ActionButton';
import LetterButtons from '../LetterButtons';
import './WritingCard.css';

export interface IWritingCard extends IBaseCard {
    class: 'writing';
    answer: string;
};

interface IWritingCardProps {
    card: IWritingCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\W+/g, '').replace(/\s+/g, ' ');
};

const WritingCardComponent = ({ card, onCorrect, onIncorrect, onComplete }: IWritingCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [userInput, setUserInput] = createSignal<string>('');
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);

    let inputRef: HTMLTextAreaElement | null = null;

    const normalizedAnswer = createMemo(() => normalizeText(card.answer));

    createEffect(() => {
        const newLangs = setQandALangs(card);
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
            onCorrect();
        } else {
            setIsCorrect(false);
            onIncorrect();
        }
    };

    return (
        <>
            <section class='card writing-card'>
                {/*<h4>{t('translate_to_lang', { lang: t(langs.a) })}</h4> */}
                <h3 class="question" lang={langs().q}>{card.question}</h3>

                <textarea
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
                onComplete={onComplete}
            />
        </>
    );
};

export default WritingCardComponent;
