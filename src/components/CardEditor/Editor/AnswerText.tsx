import { createSignal, createEffect } from 'solid-js';
import TextInput from './TextInput';
import './SelectList.css';

interface AnswerTextProps {
    list: string[];
    answer: string;
    onUpdate: (updatedList: string[], updatedAnswer?: string) => void;
}

export default function AnswerText(props: AnswerTextProps) {
    const [newWord, setNewWord] = createSignal('');
    const [localList, setLocalList] = createSignal<string[]>([]);

    createEffect(() => {
        setLocalList([...props.list]);
    });

    const handleAnswersChange = (index: number, newValue: string) => {
        const updated = [...localList()];
        updated[index] = newValue;
        setLocalList(updated);
        props.onUpdate(updated, props.answer);
    };

    const handleRemoveClick = (index: number) => {
        const updated = [...localList()];
        updated.splice(index, 1);
        setLocalList(updated);
        props.onUpdate(updated, props.answer);
    };

    const handleAddClick = () => {
        const word = newWord().trim();
        if (!word) return;

        const updated = [...localList(), word];
        setLocalList(updated);
        setNewWord('');
        props.onUpdate(updated, props.answer);
    };

    const handleCheckmarkClick = (word: string) => {
        const newAnswer = props.answer === word ? '' : word;
        props.onUpdate(localList(), newAnswer);
    };

    return (
        <section class="answer-text answer-list">
            {localList().map((word, index) => (
                <div class="answer-row">
                    <TextInput
                        label={`Option ${index + 1}`}
                        value={word}
                        onInput={(e) => handleAnswersChange(index, (e.target as HTMLInputElement).value)}
                        placeholder="Enter answer"
                    />

                    <button
                        onClick={() => handleCheckmarkClick(word)}
                        class={`large-icon-button checkmark ${props.answer === word ? 'selected' : ''}`}
                        title="Select as the correct answer"
                    >
                        {props.answer === word ? '✔' : '⭘'}
                    </button>

                    <button
                        class='large-icon-button'
                        type="button"
                        onClick={() => handleRemoveClick(index)}
                        title="Remove this answer"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div class="answer-row add-new">
                <TextInput
                    label="New Option"
                    value={newWord()}
                    onInput={(e) => setNewWord((e.target as HTMLInputElement).value)}
                    placeholder="Enter new option"
                />

                <button
                    type="button"
                    class="large-icon-button"
                    onClick={handleAddClick}
                    title="Add this entry"
                >
                    ➕
                </button>
            </div>
        </section>
    );
}
