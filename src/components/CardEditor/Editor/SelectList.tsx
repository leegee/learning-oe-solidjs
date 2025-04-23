import { createSignal } from 'solid-js';
import TextInput from './TextInput';
import './SelectList.css';

interface ISelectListProps {
    list: { [key: string]: boolean }[];
    onUpdate: (updatedList: { [key: string]: boolean }[]) => void;
}

export default function SelectList(props: ISelectListProps) {
    const [newWord, setNewWord] = createSignal('');
    const [newIsTrue, setNewIsTrue] = createSignal(false);

    const handleInputChange = (index: number, newValue: string) => {
        const updated = [...props.list];
        const word = Object.keys(updated[index])[0];
        updated[index] = { [newValue]: updated[index][word] };
        props.onUpdate(updated);
    };

    const handleCorrectToggle = (index: number) => {
        const updated = [...props.list];
        const word = Object.keys(updated[index])[0];
        updated[index] = { [word]: !updated[index][word] };
        props.onUpdate(updated);
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
        const updated = [...props.list, { [newWord()]: newIsTrue() }];
        props.onUpdate(updated);
        setNewWord('');
        setNewIsTrue(false);
    };

    return (
        <section class="boolean-text answer-list">
            {props.list.map((entry, index) => {
                const word = Object.keys(entry)[0];
                const isCorrect = entry[word];

                return (
                    <div class="answer-row">
                        <TextInput
                            label={`Option ${index + 1}`}
                            value={word}
                            onInput={(e) => handleInputChange(index, (e.target as HTMLInputElement).value)}
                            placeholder="Enter answer"
                        />
                        <button
                            class={`checkmark ${isCorrect ? 'selected' : ''}`}
                            title="Click to mark as correct answer"
                            onClick={() => handleCorrectToggle(index)}
                        >
                            <span class={`utf8-icon-${isCorrect ? "tick" : "not-tick"}`} />
                            {/* {isCorrect ? '✔' : '⭘'} */}
                        </button>

                        <button type="button" onClick={() => handleRemoveClick(index)} title="Remove this answer">
                            <span class="utf8-icon-close" />
                        </button>
                    </div>
                );
            })}

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
                    class="large-icon-button"
                    title="Add this entry"
                >
                    <span class="utf8-icon-add" />
                </button>
            </div>
        </section>
    );
}
