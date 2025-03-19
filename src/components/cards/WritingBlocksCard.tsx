import { createSignal, createEffect, For } from 'solid-js';

import { type Card } from './Card.ts';
import { setQandALangs, setQandALangsReturnType } from '../../lib/set-q-and-a-langs.ts';
import ActionButton from '../ActionButton.tsx';
import './WritingBlocksCard.css';

export type WritingBlocksCard = Card & {
    class: 'writing-blocks';
    answer: string;
    options: string[];
};

interface WritingBlocksCardProps {
    card: WritingBlocksCard;
    onCorrect: (numberOfCorrectAnswers?: number) => void;
    onIncorrect: () => void;
    onComplete: () => void;
}

const normalizeText = (text: string): string => {
    return text.trim().toLowerCase().replace(/\W+/g, '').replace(/\s+/g, ' ');
};

const WritingBlocksCard = ({ card, onCorrect, onIncorrect, onComplete }: WritingBlocksCardProps) => {
    const [langs, setLangs] = createSignal<setQandALangsReturnType>(setQandALangs(card));
    const [isCorrect, setIsCorrect] = createSignal<boolean | null>(null);
    const [selectedWords, setSelectedWords] = createSignal<string[]>([]);

    createEffect(() => {
        setLangs(setQandALangs(card));
        setSelectedWords([]);
        setIsCorrect(null);
    });

    const handleWordClick = (word: string) => {
        setIsCorrect(null);
        setSelectedWords((prev) => [...prev, word]);
    };

    const handleRemoveWord = (index: number) => {
        setIsCorrect(null);
        setSelectedWords((prev) => prev.filter((_, i) => i !== index));
    };

    const handleCheckAnswer = () => {
        const normalizedUserInput = normalizeText(selectedWords().join(' '));
        const normalizedAnswer = normalizeText(card.answer);

        if (normalizedUserInput === normalizedAnswer) {
            setIsCorrect(true);
            onCorrect();
        } else {
            setIsCorrect(false);
            onIncorrect();
        }
    };

    return (
        <>
            <section class='writing-blocks-card'>
                <h3 class="question" lang={langs().q}>{card.question}</h3>

                <div class='selected-words'>
                    <For each={selectedWords()}>
                        {(word, index) => (
                            <button class='selected-word' onClick={() => handleRemoveWord(index())}>
                                {word}
                            </button>
                        )}
                    </For>
                </div>

                <div class='options'>
                    <For each={card.options}>
                        {(word) => (
                            <button
                                class='option-button'
                                onClick={() => handleWordClick(word)}
                                disabled={selectedWords().includes(word)}
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
                onComplete={onComplete}
            />
        </>
    );
};

export default WritingBlocksCard;
