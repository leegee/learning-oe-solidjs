import { createSignal } from 'solid-js';
import TextInput from './TextInput';
import './BooleanText';
import './AnswerText.css';

interface AnswerTextProps {
    list: string[];  // List of strings
    answer: string;  // Correct answer (string)
    onUpdate: (updatedList: string[], updatedAnswer: string) => void;  // Callback to update the parent component
}

export default function AnswerText(props: AnswerTextProps) {
    const [newWord, setNewWord] = createSignal('');

    // Handle input change in the list of answers
    const handleInputChange = (index: number, newValue: string) => {
        const updated = [...props.list];
        updated[index] = newValue;
        props.onUpdate(updated, props.answer); // Pass updated list and current answer
    };

    // Handle removing an answer
    const handleRemoveClick = (index: number) => {
        const updated = [...props.list];
        updated.splice(index, 1);
        props.onUpdate(updated, props.answer); // Pass updated list and current answer
    };

    // Handle adding a new answer
    const handleAddClick = () => {
        if (!newWord()) return; // Don't add empty answers
        const updated = [...props.list, newWord()];
        props.onUpdate(updated, props.answer); // Pass updated list and current answer
        setNewWord(''); // Reset the input
    };

    // Handle toggling the correct answer status
    const handleCheckmarkClick = (word: string) => {
        if (props.answer === word) {
            props.onUpdate(props.list, ''); // Unmark if it's already the answer
        } else {
            props.onUpdate(props.list, word); // Set the selected answer
        }
    };

    return (
        <section class="answer-text answer-list">
            {/* Render each answer in the list */}
            {JSON.stringify(props.list)}
            {props.list.map((word, index) => (
                <div class="answer-row" >
                    {/* Text Input for each answer */}
                    <TextInput
                        label={`Option ${index + 1}`}
                        value={word}
                        onInput={(e) => handleInputChange(index, (e.target as HTMLInputElement).value)}
                        placeholder="Enter answer"
                    />
                    {/* Checkmark to select the correct answer */}
                    <span
                        onClick={() => handleCheckmarkClick(word)}
                        class={`checkmark ${props.answer === word ? 'selected' : ''}`}
                        title="Select as the correct answer"
                    >
                        {props.answer === word ? '✔' : '◯'}
                    </span>
                    {/* Remove button */}
                    <button
                        type="button"
                        onClick={() => handleRemoveClick(index)}
                        title="Remove this answer"
                    >
                        ✕
                    </button>
                </div>
            ))}

            {/* Input fields for adding a new word */}
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
