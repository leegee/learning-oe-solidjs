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
    IVocabMatchCard,
    isAnyCardWithAnswer,
    WritingBlocksCardComponent,
} from "./cards";
import BooleanText from "./Editor/BooleanText";
import AnswerText from "./Editor/AnswerText";
import VocabText from "./Editor/VocabText";

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
    const [vocab, setVocab] = createSignal<{ [key: string]: string }>({});

    createEffect(() => {
        if (!props.card) {
            console.warn('No card!');
            return;
        }

        if ("answer" in props.card) {
            setAnswer(props.card.answer || "");
        }
        if ("answers" in props.card) {
            setAnswers(props.card.answers || []);
        }
        if ("options" in props.card) {
            setOptions((props.card as IWritingBlocksCard).options);
        }
        if ("question" in props.card) {
            setQuestion((props.card as IBlanksCard).question);
        }
        if ("words" in props.card) {
            setWords((props.card as IBlanksCard).words);
        }
        if ("vocab" in props.card) {
            setVocab(props.card.vocab);
        }
    });

    const handleSave = () => {
        if (!props.card) {
            return;
        }

        const updatedCard = { ...props.card } as IAnyCard;

        if ("answers" in updatedCard) {
            (updatedCard as IMultipleChoiceCard).answers = answers();
        }
        if ("answer" in updatedCard) {
            (updatedCard as IAnyCardWithAnswer).answer = answer();
        }
        if ("options" in updatedCard) {
            (updatedCard as IWritingBlocksCard).options = options();
        }
        if ("question" in props.card) {
            (updatedCard as IBlanksCard).question = question();
        }
        if ("words" in updatedCard) {
            (updatedCard as IBlanksCard).words = words();
        }
        if ("vocab" in updatedCard) {
            (updatedCard as IVocabMatchCard).vocab = vocab();
        }


        props.onSave(updatedCard);
    };

    function onUpdate(
        callback: Function,
        answerOptions: any,
        answer?: string,
    ): void {
        callback(answerOptions);
        if (answer && isAnyCardWithAnswer(props.card!)) {
            setAnswer(answer);
        }
        // If there is an answer that doesn't match the answerOptions, remove it
    }

    if (!props.card) {
        return 'No card';
    }

    return (
        <aside class="modal-bg">
            <div class="edit-card-modal card" onClick={(e: Event) => e.stopPropagation()}>
                <section>
                    <h2>Edit Card</h2>
                    <pre>{JSON.stringify(props.card, null, 4)}</pre>

                    {question()
                        && <section class='question'>
                            <TextInput
                                label={`Question`}
                                value={question() ?? ''}
                                onInput={(e) => setQuestion((e.target as HTMLInputElement).value)}
                                placeholder="Option: enter a question"
                            />
                        </section>
                    }

                    {(props.card! as IAnyCardWithAnswer).answer
                        && props.card.class !== 'writing-blocks'
                        && props.card.class !== 'multiple-choice'
                        && <TextInput
                            label={`Answer`}
                            value={(props.card as IAnyCardWithAnswer).answer}
                            onInput={(e: InputEvent) => setAnswer((e.target as HTMLInputElement).value) as string}
                            placeholder="Enter answer"
                        />
                    }

                    {"words" in props.card
                        && <BooleanText
                            list={words()}
                            onUpdate={(...args) => onUpdate(setWords, ...args)}
                        />
                    }

                    {"answers" in props.card
                        && <AnswerText
                            answer={answer()}
                            list={answers()}
                            onUpdate={(...args) => onUpdate(setAnswers, ...args)}
                        />
                    }

                    {"options" in props.card
                        && <AnswerText
                            answer={answer()}
                            list={options()}
                            onUpdate={(...args) => onUpdate(setOptions, ...args)}
                        />
                    }

                    {"vocab" in props.card
                        && <VocabText
                            list={vocab()}
                            onUpdate={(...args) => onUpdate(setVocab, ...args)}
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
