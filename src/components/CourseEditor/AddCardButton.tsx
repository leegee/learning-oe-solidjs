import "./AddCardButton.css";
import { createSignal, Show, For } from "solid-js";
import { CARD_CLASSES } from "../Cards";

export default function AddCardButton(props: {
    onAdd: (cardClass: string) => void;
}) {
    const [showOptions, setShowOptions] = createSignal(false);

    return (
        <div class={'add-card'} >
            <Show when={!showOptions()}>
                <button class={'add-card'} onClick={() => setShowOptions(true)} title='Add a new card to this lesson'>
                    <span class="utf8-icon-add" />
                </button>
            </Show>

            <Show when={showOptions()}>
                <div class={'card-class-picker'}>
                    <button class='delete-button' onClick={() => setShowOptions(false)}>
                        <span class="utf8-icon-close" />
                    </button>

                    <For each={CARD_CLASSES}>
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
                </div>
            </Show>
        </div>
    );
}
