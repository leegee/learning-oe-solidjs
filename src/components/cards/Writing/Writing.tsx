import './Writing.css';
import { createSignal, createMemo, createResource, Show } from 'solid-js';
import { type IBaseCard } from '../BaseCard.type.ts';
import { setQandALangs } from '../../../lib/set-q-and-a-langs.ts';
import ActionButton from '../../ActionButton/index.ts';
import LetterButtons from '../../LetterButtons/LetterButtons.tsx';
import { useI18n } from '../../../contexts/I18nProvider.tsx';
import { LanguageCode, speakLetter } from '../../../lib/speak-letters.ts';
import { normalizeText } from '../../../lib/normalise-text.ts';

export interface IWritingCard extends IBaseCard {
    class: 'writing';
    answer: string;
};

export const defaultCard: IWritingCard = {
    class: 'writing',
    qlang: 'default',
    question: 'Question',
    answer: 'Answer'
};

export interface IWritingCardProps {
    card: IWritingCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const WritingCardComponent = (props: IWritingCardProps) => {
    const [langs] = createResource(() => setQandALangs(props.card));
    const { t } = useI18n();
    const [userInput, setUserInput] = createSignal<string>('');
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);

    let inputRef: HTMLTextAreaElement | null = null;

    const normalizedAnswer = createMemo(() => normalizeText(props.card.answer));

    const setTheUserInput = (text: string) => {
        setIsCorrect(null);
        setUserInput(text);
    }

    const handleLetterButtonClick = (letter: string) => {
        if (!inputRef) return;

        speakLetter(letter, langs()!.a as LanguageCode);

        const input = inputRef;
        const start = input.selectionStart ?? userInput().length;
        const end = input.selectionEnd ?? userInput().length;

        // Insert or replace text at the cursor/selection
        const newValue = userInput().slice(0, start) + letter + userInput().slice(end);
        setTheUserInput(newValue);

        // Move cursor after inserted letter - after the state change but before the re-render
        queueMicrotask(() => {
            input.selectionStart = input.selectionEnd = start + letter.length;
            input.focus();
        });
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
        <Show when={langs()?.a} fallback={<p>Loading...</p>}>
            <section class='card writing-card'>
                {langs()!.q !== langs()!.a &&
                    <h4>{t('translate_to_lang', { lang: t(langs()!.a) })}</h4>
                }
                <h3 class="question" lang={langs()!.q}>{props.card.question}</h3>

                <div class='input'>
                    <textarea
                        id='writing-input'
                        class='answer'
                        placeholder={t('type_in') + ' ' + t(langs()!.a) + '...'}
                        ref={el => inputRef = el}
                        lang={langs()!.a}
                        value={userInput()}
                        autofocus={true}
                        onInput={(e) => setTheUserInput(e.target.value)}
                        aria-label={t('enter_answer')}
                    />

                    <LetterButtons
                        lang={langs()!.a}
                        onSelect={handleLetterButtonClick}
                        text={props.card.answer}
                    />
                </div>
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={userInput().length > 0}
                onCheckAnswer={handleCheckAnswer}
                onComplete={next}
            />
        </Show>
    );
};

export default WritingCardComponent;
