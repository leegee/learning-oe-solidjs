import './Blanks.css';
import { createSignal, createEffect, createResource, Show } from 'solid-js';
import { shuffleArray } from '../../../lib/shuffle-array';
import { type IBaseCard } from '../BaseCard.type';
import { setQandALangs } from '../../../lib/set-q-and-a-langs';
import ActionButton from '../../ActionButton';
import { useI18n } from '../../../contexts/I18nProvider';

export interface IBooleanWord {
    [word: string]: boolean
};

export interface IBlanksCard extends IBaseCard {
    class: 'blanks';
    question: string;
    words: IBooleanWord[]
}

export const defaultCard: IBlanksCard = {
    class: 'blanks',
    question: 'Question',
    qlang: 'default',
    words: [{ 'answer': true, 'other': false }],
};

export interface IBlanksCardProps {
    card: IBlanksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const BlanksCardComponent = (props: IBlanksCardProps) => {
    const { t } = useI18n();
    const [langs] = createResource(() => setQandALangs(props.card));
    const [shuffledWords, setShuffledWords] = createSignal<string[]>([]);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
    const [isCorrect, setIsCorrect] = createSignal<null | boolean>(null);
    const [showResult, setShowResult] = createSignal(false);
    const [shake, setShake] = createSignal<string | null>(null);

    createEffect(() => {
        setShuffledWords(shuffleArray(props.card.words.map(word => Object.keys(word)[0])));
    });

    const handleClick = (word: string) => {
        if (selectedWords().includes(word)) return;
        setSelectedWords([...selectedWords(), word]);
        setShowResult(false);
    };

    const checkAnswer = () => {
        const correctOrder = props.card.words
            .filter(word => Object.values(word)[0])
            .map(item => Object.keys(item)[0]);

        const correct = selectedWords().length === correctOrder.length
            && selectedWords().every((word, index) => word === correctOrder[index]);

        if (correct) {
            setShowResult(true);
            setIsCorrect(true);
            props.onCorrect(selectedWords().length);
        } else {
            setShowResult(false);
            setIsCorrect(false);
            props.onIncorrect();
            setShake('incomplete');
            setTimeout(() => setShake(null), 1000);
        }
    };

    const whenComplete = () => {
        if (isCorrect()) {
            props.onComplete();
        }
    };

    const reset = () => {
        setSelectedWords([]);
        setIsCorrect(null);
    }

    // Build the sentence JSX with blanks replaced by selected words if available
    const renderedSentence = () => {
        let selectedIndex = 0;
        const correctOrder = props.card.words.filter(w => Object.values(w)[0]).map(w => Object.keys(w)[0]);

        return props.card.question.split(/([\s\b])/).map((word) => {
            if (/^_{2,}/.test(word)) {
                // If user has selected a word for this blank, show it
                const selectedWord = selectedWords()[selectedIndex];
                const correctWord = correctOrder[selectedIndex];
                selectedIndex++;

                if (showResult()) {
                    // After checking, show with correct/incorrect styles
                    const isWordCorrect = selectedWord === correctWord;
                    return (
                        <span class={isWordCorrect ? 'blank-correct' : 'blank-incorrect'}>
                            {selectedWord}
                        </span>
                    );
                } else {
                    // Before checking, show selected word or blank placeholder
                    return (
                        <span class={selectedWord ? 'blank-filled' : 'blank'}>
                            {selectedWord ?? '__'}
                        </span>
                    );
                }
            } else {
                return <span class='provided-word'>{word}</span>;
            }
        });
    };

    return (
        <Show when={langs()} fallback={<p>Loading...</p>}>
            <section class="card blanks-card">
                <h4>{t('fill_in_the_blanks')}</h4>
                <h3 class="question" lang={langs()!.q} dir={langs()!.q === 'heb' ? 'rtl' : 'ltr'}>
                    {renderedSentence()}
                </h3>

                <div class="word-options">
                    {shuffledWords().map((word) => {
                        const isSelected = selectedWords().includes(word);
                        const shakeClass = shake() === word ? 'shake' : '';
                        // Disable buttons if selected or if completed correctly
                        const disabled = isSelected || (isCorrect() === true);
                        const className = 'word-option ' + (isSelected ? 'selected' : '') + ' ' + shakeClass;
                        const label = isSelected ? `${word} (${t('selected')})` : `${t('select')} ${word}`;

                        return (
                            <button
                                lang={langs()!.a}
                                onClick={() => handleClick(word)}
                                disabled={disabled}
                                class={className}
                                aria-label={label}
                            >
                                {word}
                            </button>
                        );
                    })}
                </div>
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={selectedWords().length > 0}
                onCheckAnswer={checkAnswer}
                onComplete={whenComplete}
                onReset={reset}
            />
        </Show>
    );
};

export default BlanksCardComponent;
