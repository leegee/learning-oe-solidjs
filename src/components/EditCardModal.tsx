import { createSignal, createEffect } from "solid-js";
import TextInput from "./Editor/TextInput";
import './EditCardModal.css';
import {
    IAnyCard,
    IBlanksCard,
    IMultipleChoiceCard,
    IDynamicVocabCard,
    IWritingCard,
    IAnyCardWithAnswer,
    IBooleanWord,
    IWritingBlocksCard,
} from "./cards";
import BooleanText from "./Editor/BooleanText";
import AnswerText from "./Editor/AnswerText";

interface EditCardModalProps {
    card: IAnyCard | null;
    onSave: (updatedCard: IAnyCard) => void;
    onCancel: (e: Event) => void;
}

const EditCardModal = (props: EditCardModalProps) => {
    const [words, setWords] = createSignal<IBooleanWord[]>([]);
    const [options, setOptions] = createSignal<string[]>([]);
    const [answers, setAnswers] = createSignal<string[]>([]);
    const [answer, setAnswer] = createSignal<string>("");
    const [question, setQuestion] = createSignal<string>("");

    createEffect(() => {
        if (!props.card) {
            console.warn('No card!');
            return;
        }

        if ("question" in props.card) {
            setQuestion((props.card as IBlanksCard).question);
        }

        if ("words" in props.card) {
            setWords((props.card as IBlanksCard).words);
        }

        if ("options" in props.card) {
            setOptions((props.card as IWritingBlocksCard).options);
        }

        if ("answers" in props.card) {
            setAnswers(props.card.answers || []);
        }

        if ("answer" in props.card) {
            setAnswer(props.card.answer || "");
        }
    });

    const handleSave = () => {
        const original = props.card;
        if (!original) {
            return;
        }

        const updatedCard = { ...original } as IAnyCard;

        if ("answers" in updatedCard) {
            (updatedCard as IMultipleChoiceCard).answers = answers();
        }
        if ("answer" in updatedCard) {
            (updatedCard as IAnyCardWithAnswer).answer = answer();
        }

        props.onSave(updatedCard);
    };

    return (
        <aside class="modal-bg">
            <div class="edit-card-modal card" onClick={(e: Event) => e.stopPropagation()}>
                <section>
                    <h2>Edit Card</h2>
                    <pre>{JSON.stringify(props.card, null, 4)}</pre>

                    {
                        question()
                        && <TextInput
                            label={`Question`}
                            value={question() ?? ''}
                            onInput={(e) => setQuestion((e.target as HTMLInputElement).value)}
                            placeholder="Option: enter a question"
                        />
                    }

                    {(props.card! as IAnyCardWithAnswer).answer
                        && <TextInput
                            label={`Answer`}
                            value={(props.card as IAnyCardWithAnswer).answer}
                            onInput={(e: InputEvent) => setAnswer((e.target as HTMLInputElement).value) as string}
                            placeholder="Enter answer"
                        />
                    }

                    {/* For IBlanksCard's .words */}
                    {"words" in props.card!
                        && <BooleanText list={words()} onUpdate={(updatedWords) => setWords(updatedWords)} />
                    }

                    {"answers" in props.card!
                        && <AnswerText
                            answer={answer()}
                            list={answers()}
                            onUpdate={(updatedAnswers) => setAnswers(updatedAnswers)}
                        />
                    }

                    {"options" in props.card!
                        && <AnswerText
                            answer={answer()}
                            list={options()}
                            onUpdate={(updatedOptions) => setOptions(updatedOptions)}
                        />
                    }
                </section>

                <footer class="modal-actions">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={props.onCancel}>Cancel</button>
                </footer>
            </div>
        </aside>
    );
};

export default EditCardModal;
