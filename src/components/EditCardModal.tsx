import { createSignal, Show, Switch, Match, onCleanup, createEffect } from "solid-js";
import {
    AnyCardWithAnswer,
    hasAnswerField,
    IBlanksCard,
    IMultipleChoiceCard,
    IWritingBlocksCard,
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
    const [newOption, setNewOption] = createSignal('');

    createEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            e.stopPropagation();
            if (e.key === 'Escape') {
                // props.onCancel();
                // Do nothing
                console.log('even propogation stopped, escape pressed, nothing should happen but earlier event listeners are catching the signal too.')
            }
        };

        window.addEventListener('keydown', handleKeys, true);
        onCleanup(() => window.removeEventListener('keydown', handleKeys, true));
        // }
    });

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

    // Update answers when options change
    const updateAnswers = (updatedAnswers: string[]) => {
        setCard({ ...card(), options: updatedAnswers });
    };

    // Update the correct answer
    const updateAnswer = (newAnswer: string) => {
        setCard({ ...card(), answer: newAnswer });
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

                <Switch fallback={<p>Unknown card: {JSON.stringify(card(), null, 2)}</p>}>
                    <Match when={card().class === "writing"}>
                        <span />
                    </Match>


                    <Match when={card().class === "blanks"}>
                        <section class="blanks-edit">
                            <h4>Correct Words for Blanks</h4>

                            <div class="blanks-word-list">
                                {(card() as IBlanksCard).words.map((wordObj, idx) => {
                                    const word = Object.keys(wordObj)[0];
                                    return (
                                        <div class="answer-row">
                                            <input
                                                type="text"
                                                value={word}
                                                onInput={(e) => {
                                                    const updatedWords = [...(card() as IBlanksCard).words];
                                                    updatedWords[idx] = { [e.currentTarget.value]: true };
                                                    setCard({ ...card(), words: updatedWords });
                                                }}
                                            />
                                            <button class='icon'
                                                onClick={() => {
                                                    const updatedWords = [...(card() as IBlanksCard).words];
                                                    updatedWords.splice(idx, 1);
                                                    setCard({ ...card(), words: updatedWords });
                                                }}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            <div class="blanks-add-word">
                                <input
                                    type="text"
                                    placeholder="New word"
                                    value={newOption()}
                                    onInput={(e) => setNewOption(e.currentTarget.value)}
                                />
                                <button
                                    onClick={() => {
                                        const newWord = newOption().trim();
                                        if (newWord) {
                                            const updatedWords = [...(card() as IBlanksCard).words, { [newWord]: true }];
                                            setCard({ ...card(), words: updatedWords });
                                            setNewOption('');
                                        }
                                    }}
                                >
                                    Add Word ➕
                                </button>
                            </div>

                            <p class="blanks-help">
                                Use underscores (`__`) in the question text to indicate blank positions. The number of blanks must match the number of words listed above.
                            </p>
                        </section>
                    </Match>

                    <Match when={card().class === "writing-blocks"}>
                        <section class="writing-blocks-edit">
                            <h4>Edit Options for Writing Blocks</h4>

                            <div class="options-list">
                                {(card() as IWritingBlocksCard).options.map((option, idx) => {
                                    const isCorrect = option === (card() as IWritingBlocksCard).answer;
                                    return (
                                        <AnswerRow
                                            option={option}
                                            index={idx}
                                            isCorrect={isCorrect}
                                            answers={(card() as IWritingBlocksCard).options}
                                            answer={(card() as IWritingBlocksCard).answer}
                                            updateAnswers={updateAnswers}
                                            updateAnswer={updateAnswer}
                                        />
                                    );
                                })}
                            </div>

                            <div>
                                <input
                                    type="text"
                                    placeholder="New Option"
                                    value={newOption()}
                                    onInput={(e) => setNewOption(e.currentTarget.value)}
                                />
                                <button
                                    onClick={() => {
                                        if (newOption().trim()) {
                                            const updatedOptions = [...(card() as IWritingBlocksCard).options, newOption()];
                                            setCard({ ...card(), options: updatedOptions });
                                            setNewOption(''); // Clear input after adding
                                        }
                                    }}
                                >
                                    Add Option ➕
                                </button>
                            </div>
                        </section>
                    </Match>
                </Switch>

                <footer class="modal-actions">
                    <button
                        onClick={() => props.onSave(card())}
                        disabled={!isAnswerValid()}
                    >
                        ✓ Save
                    </button>
                    <button onClick={props.onCancel} >
                        ✕ Cancel
                    </button>
                </footer>
            </section>
        </article>
    );
}
