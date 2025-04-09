import { createSignal, Show, Switch, Match } from "solid-js";
import { AnyCardWithAnswer, hasAnswerField, type AnyCard } from "./cards";
import './EditCardModal.css';

export default function EditCardModal(props: {
    card: AnyCard;
    onSave: (card: AnyCard) => void;
    onCancel: () => void;
}) {
    const [card, setCard] = createSignal({ ...props.card });

    const updateField = <K extends keyof AnyCard>(field: K, value: AnyCard[K]) => {
        setCard({ ...card(), [field]: value });
    };

    const handleModalClick = (e: MouseEvent) => {
        e.stopPropagation(); // Prevent background click from closing modal
    };

    return (
        <article class="modal-bg" onClick={props.onCancel}>
            <section class="edit-card-modal" onClick={handleModalClick}>
                <h2>Edit Card</h2>

                <label>
                    <h3>Question:</h3>
                    <textarea
                        value={card().question || ""}
                        onInput={(e) => updateField("question", e.currentTarget.value)}
                    />
                </label>

                <Switch fallback={<p>{JSON.stringify(card(), null, 2)}</p>}>
                    <Match when={card().class === "dynamic-vocab"}>
                        <p>Dynamic vocab requires no intervention.</p>
                    </Match>

                    <Match when={card().class === "writing"}>
                        <p>TODO: Editing interface for "writing.option" field</p>
                    </Match>

                    <Match when={card().class === "writing-blocks"}>
                        <p>TODO: Editing interface for "writing-blocks.option" field</p>
                    </Match>

                    <Match when={card().class === "multiple-choice"}>
                        <p>TODO: Editing interface for "multiple-choice.answers" field</p>
                    </Match>

                    <Match when={card().class === "vocab"}>
                        <p>TODO: Editing interface for "vocab.vocab" field</p>
                    </Match>
                </Switch>

                {/* Conditionally render the answer field if the card has an 'answer' */}
                <Show when={hasAnswerField(card())}>
                    <label>
                        <h3>Answer:</h3>
                        <textarea
                            value={(card() as AnyCardWithAnswer).answer}
                            onInput={(e) =>
                                setCard({ ...card(), answer: e.currentTarget.value })
                            }
                        />
                    </label>
                </Show>

                <footer class="modal-actions">
                    <button onClick={() => props.onSave(card())}>Save</button>
                    <button onClick={props.onCancel}>Cancel</button>
                </footer>
            </section>
        </article>
    );
}
