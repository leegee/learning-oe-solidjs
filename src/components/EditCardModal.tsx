import { createSignal, Show, Switch, Match, For } from "solid-js";
import {
    AnyCardWithAnswer,
    hasAnswerField,
    IMultipleChoiceCard,
    type AnyCard
} from "./cards";
import AnswerRow from "./Editor/AnswerRow";
import "./EditCardModal.css";

export default function EditCardModal(props: {
    card: AnyCard;
    onSave: (card: AnyCard) => void;
    onCancel: () => void;
}) {
    const [card, setCard] = createSignal<AnyCard>({ ...props.card });

    // Check if the card has an answer and it's filled
    const isAnswerValid = () => {
        if (card().class === "multiple-choice") {
            return (card() as IMultipleChoiceCard).answers.length > 0 &&
                (card() as IMultipleChoiceCard).answer !== "";
        }
        if (hasAnswerField(card())) {
            return (card() as AnyCardWithAnswer).answer !== "";
        }
        return true;
    };

    const updateField = <K extends keyof AnyCard>(field: K, value: AnyCard[K]) => {
        setCard({ ...card(), [field]: value });
    };

    const updateMCField = <K extends keyof IMultipleChoiceCard>(field: K, value: IMultipleChoiceCard[K]) => {
        setCard({ ...card(), [field]: value } as IMultipleChoiceCard);
    };

    const handleModalClick = (e: MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <article class="modal-bg" onClick={handleModalClick}>
            <section class={`edit-card-modal ${card().class}`} onClick={handleModalClick}>
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
                        <h3>Answers:</h3>
                        <For each={(card() as IMultipleChoiceCard).answers || []}>
                            {(option, i) => (
                                <AnswerRow
                                    option={option}
                                    index={i()}
                                    isCorrect={option === (card() as IMultipleChoiceCard).answer}
                                    answers={(card() as IMultipleChoiceCard).answers || []}
                                    answer={(card() as IMultipleChoiceCard).answer}
                                    updateAnswers={(updatedAnswers) =>
                                        updateMCField("answers", updatedAnswers)
                                    }
                                    updateAnswer={(newAnswer) => updateMCField("answer", newAnswer)}
                                />
                            )}
                        </For>

                        <button
                            id="add-answer-button"
                            type="button"
                            onClick={() => {
                                const updated = [...((card() as IMultipleChoiceCard).answers || [])];
                                updated.push("");
                                updateMCField("answers", updated);
                            }}
                        >
                            Add Answer ➕
                        </button>
                    </Match>

                    <Match when={card().class === "vocab"}>
                        <p>TODO: Editing interface for "vocab.vocab" field</p>
                    </Match>
                </Switch>

                {/* Conditionally render the answer field if the card has an 'answer' */}
                <Show when={hasAnswerField(card())}>
                    <label class="answer-section">
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
                    <button
                        onClick={() => props.onSave(card())}
                        disabled={!isAnswerValid()}
                    >
                        Save
                    </button>
                    <button onClick={props.onCancel} >
                        Cancel
                    </button>
                </footer>
            </section>
        </article>
    );
}
