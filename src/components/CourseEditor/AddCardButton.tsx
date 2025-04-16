import { createSignal, Show, For } from "solid-js";
import "./AddCardButton.css";

const CARD_TYPES = ["note", "vocab", "example", "image"];

export default function AddCardButton(props: {
    onAdd: (cardClass: string) => void;
}) {
    const [showOptions, setShowOptions] = createSignal(false);

    return (
        <div class={'add-card'}>
            <Show when={!showOptions()}>
                <button class={'add-card'} onClick={() => setShowOptions(true)}>➕</button>
            </Show>

            <Show when={showOptions()}>
                <div class={'card-class-picker'}>
                    <For each={CARD_TYPES}>
                        {(type) => (
                            <button
                                onClick={() => {
                                    props.onAdd(type);
                                    setShowOptions(false);
                                }}
                            >
                                {type}
                            </button>
                        )}
                    </For>
                    <button onClick={() => setShowOptions(false)}>Cancel</button>
                </div>
            </Show>
        </div>
    );
}
