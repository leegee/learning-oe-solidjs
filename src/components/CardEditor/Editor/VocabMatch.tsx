import { createMemo, createSignal } from 'solid-js';
import TextInput from './TextInput';
import './SelectList.css';

interface VocabTextProps {
    list: { [key: string]: string };
    onUpdate: (updatedVocab: { [key: string]: string }) => void;
}

export default function VocabText(props: VocabTextProps) {
    const [newKey, setNewKey] = createSignal('');
    const [newValue, setNewValue] = createSignal('');

    const entries = createMemo(() => Object.entries(props.list));

    const handleKeyChange = (index: number, newKeyValue: string) => {
        const updated = { ...props.list };
        const oldKey = entries()[index][0];
        const value = updated[oldKey];
        delete updated[oldKey];
        updated[newKeyValue] = value;
        props.onUpdate(updated);
    };

    const handleValueChange = (index: number, newValueText: string) => {
        const updated = { ...props.list };
        const key = entries()[index][0];
        updated[key] = newValueText;
        props.onUpdate(updated);
    };

    const handleRemoveClick = (index: number) => {
        const updated = { ...props.list };
        const key = entries()[index][0];
        delete updated[key];
        props.onUpdate(updated);
    };

    const handleAddClick = () => {
        if (!newKey() || !newValue()) return;
        const updated = { ...props.list, [newKey()]: newValue() };
        props.onUpdate(updated);
        setNewKey('');
        setNewValue('');
    };

    return (
        <section class="vocab-text answer-list">
            {entries().map(([key, value], index) => (
                <div class="answer-row">
                    <TextInput
                        label={`Prompt ${index + 1}`}
                        value={key}
                        onInput={(e) => handleKeyChange(index, (e.target as HTMLInputElement).value)}
                        placeholder="Enter prompt"
                    />
                    <TextInput
                        label={`Answer ${index + 1}`}
                        value={value}
                        onInput={(e) => handleValueChange(index, (e.target as HTMLInputElement).value)}
                        placeholder="Enter answer"
                    />
                    <button
                        type="button"
                        onClick={() => handleRemoveClick(index)}
                        title="Remove this entry"
                    >
                        ✕
                    </button>
                </div>
            ))}

            <div class="answer-row add-new">
                <TextInput
                    label="New Prompt"
                    value={newKey()}
                    onInput={(e) => setNewKey((e.target as HTMLInputElement).value)}
                    placeholder="Enter new prompt"
                />
                <TextInput
                    label="New Answer"
                    value={newValue()}
                    onInput={(e) => setNewValue((e.target as HTMLInputElement).value)}
                    placeholder="Enter new answer"
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
