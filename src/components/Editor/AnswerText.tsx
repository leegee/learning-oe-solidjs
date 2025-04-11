import { createSignal } from 'solid-js';
import TextInput from './TextInput';
import './BooleanText';
import './AnswerText.css';

interface AnswerTextProps {
    list: string[];  // List of strings
    answer: string;  // Correct answer (string)
    onUpdate: (updatedList: string[], updatedAnswer?: string) => void;  // Callback to update the parent component
}

export default function AnswerText(props: AnswerTextProps) {
    const [newWord, setNewWord] = createSignal('');

    const handleAnswersChange = (index: number, newValue: string) => {
        const updated = [...props.list];
        updated[index] = newValue;
        props.onUpdate(updated, newValue);
    };

    const handleRemoveClick = (index: number) => {
        const updated = [...props.list];
        updated.splice(index, 1);
        props.onUpdate(updated);
    };

    const handleAddClick = () => {
        if (!newWord()) {
            return;
        }
        const updated = [...props.list, newWord()];
        props.onUpdate(updated);
        setNewWord('');
    };

    // Handle toggling the correct answer status
    const handleCheckmarkClick = (word: string) => {
        if (props.answer === word) {
            props.onUpdate(props.list, '');
        } else {
            props.onUpdate(props.list, word);
        }
    };

    return (
        <section class="answer-text answer-list">
            {props.list.map((word, index) => (
                <div class="answer-row" >
                    <TextInput
                        label={`Option ${index + 1}`}
                        value={word}
                        onInput={(e) => handleAnswersChange(index, (e.target as HTMLInputElement).value)}
                        placeholder="Enter answer"
                    />

                    <span
                        onClick={() => handleCheckmarkClick(word)}
                        class={`checkmark ${props.answer === word ? 'selected' : ''}`}
                        title="Select as the correct answer"
                    >
                        {props.answer === word ? '✔' : '◯'}
                    </span>

                    <button
                        class='remove-button'
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
                    onClick={handleAddClick}
                    title="Add this entry"
                >
                    ➕
                </button>
            </div>
        </section>
    );
}
