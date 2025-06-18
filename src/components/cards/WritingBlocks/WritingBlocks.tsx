import { createSignal, createEffect, For, createMemo, createResource, Show } from 'solid-js';

import { type IBaseCard } from '../BaseCard.type';
import { setQandALangs } from '../../../lib/set-q-and-a-langs';
import ActionButton from '../../ActionButton';
import './WritingBlocks.css';
import { useI18n } from '../../../contexts/I18nProvider';

export interface IWritingBlocksCard extends IBaseCard {
    question: string;
    class: 'writing-blocks';
    answer: string;
    options: string[];
};

export const defaultCard: IWritingBlocksCard = {
    class: 'writing-blocks',
    qlang: 'default',
    question: 'Question',
    answer: 'Answer',
    options: ['Answer', 'Another']
};

export interface IWritingBlocksCardProps {
    card: IWritingBlocksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/[^\s\w]+/g, '').replace(/\s+/g, ' ');
};

const WritingBlocksCardComponent = (props: IWritingBlocksCardProps) => {
    let lastSubmittedInput = '';
    const { t } = useI18n();
    const [langs] = createResource(() => setQandALangs(props.card));
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);
    const normalizedAnswer = createMemo(() =>
        normalizeText(props.card.answer)
    );

    const handleWordClick = (word: string) => {
        setIsCorrect(null);
        setSelectedWords((prev) => [...prev, word]);
    };

    const handleRemoveWord = (index: number) => {
        setIsCorrect(null);
        setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCheckAnswer = () => {
        console.log('WritingBlocks handleCheckAnswer')
        const normalizedUserInput = normalizeText(selectedWords().join(' '));
        console.log(`WritingBlocks normalizedUserInput = ${normalizedUserInput} vs ${normalizedAnswer()}`)
        if (normalizedUserInput === normalizedAnswer()) {
            console.log('WritingBlocks CORRECT')
            setIsCorrect(true);
            props.onCorrect();
        } else {
            console.log('WritingBlocks INCORRECT')
            setIsCorrect(false);
            props.onIncorrect();
        }
    };


    createEffect(() => {
        setSelectedWords([]);
        setIsCorrect(null);
    });

    createEffect(() => {
        const currentInput = normalizeText(selectedWords().join(' '));
        if (isCorrect() !== null && currentInput !== lastSubmittedInput) {
            setIsCorrect(null);
            setSelectedWords([]);
        }
    });

    return (
        <Show when={langs()} fallback={<p>Loading...</p>}>
            <section class='writing-blocks-card card'>
                <h3 class="question" lang={langs()!.q}>{props.card.question}</h3>

                <div class='selected-words'>
                    <For each={selectedWords()}>
                        {(word, index) => (
                            <button class='selected-word'
                                onClick={() => handleRemoveWord(index())}
                                aria-label={`Remove word: ${word}`}
                            >
                                {word}
                            </button>
                        )}
                    </For>
                </div>

                <hr />

                <div class='options'>
                    <For each={props.card.options}>
                        {(word) => (
                            <button
                                class='option-button'
                                onClick={() => handleWordClick(word)}
                                disabled={selectedWords().includes(word)}
                                aria-label={selectedWords().includes(word) ? `${word} (${t('selected')})` : `${t('select')} ${word}`}
                            >
                                {word}
                            </button>
                        )}
                    </For>
                </div>
            </section>

            <ActionButton
                isCorrect={isCorrect()}
                isInputPresent={selectedWords().length > 0}
                onCheckAnswer={handleCheckAnswer}
                onComplete={props.onComplete}
            />
        </Show>
    );
};

export default WritingBlocksCardComponent;
