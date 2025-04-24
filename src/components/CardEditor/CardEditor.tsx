import './CardEditor.css';
import { createSignal, createEffect, Show } from "solid-js";
import TextInput from "./Editor/TextInput";
import {
    IAnyCard,
    IBlanksCard,
    IMultipleChoiceCard,
    IAnyCardWithAnswer,
    IWritingBlocksCard,
    IVocabMatchCard,
    isAnyCardWithAnswer,
} from "../Cards";

import SelectList from "./Editor/SelectList";
import AnswerText from "./Editor/AnswerText";
import VocabText from "./Editor/VocabMatch";
import { IBooleanWord } from '../Cards/Blanks/Blanks';
import { useI18n } from '../../contexts/I18nProvider';

interface EditCardModalProps {
    card: IAnyCard | null;
    onSave: (updatedCard: IAnyCard) => void;
    onCancel: (e: Event) => void;
}

const CardEditor = (props: EditCardModalProps) => {
    const { t } = useI18n();
    const [answers, setAnswers] = createSignal<string[]>([]);
    const [answer, setAnswer] = createSignal<string>("");
    const [question, setQuestion] = createSignal<string>("");
    const [vocab, setVocab] = createSignal<{ [key: string]: string }>({});
    const [options, setOptions] = createSignal<string[]>([]);
    const [words, setWords] = createSignal<IBooleanWord[]>([]);


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

    const onSave = () => {
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
        // TODO If there is an answer that doesn't match the answerOptions, remove it?
    }

    return (
        <Show when={props.card} fallback={<p>Loading card...</p>}>
            {(card) => {

                return (
                    <aside class="card-editor card" onClick={(e: Event) => e.stopPropagation()}>
                        <section>
                            <h2>Editing {t('card-class.' + props.card?.class as string)} Card
                                <button title={t('cacnel')} onClick={props.onCancel} class="close-editor large-icon-button">
                                    <span class="utf8-icon-close" />
                                </button>
                            </h2>

                            {/* <pre>{JSON.stringify(card(), null, 4)}</pre> */}

                            {question()
                                && <section class='question'>
                                    <TextInput
                                        multiline={true}
                                        label={`Question`}
                                        value={question() ?? 'Question'}
                                        onInput={(e) => setQuestion((e.target as HTMLInputElement).value)}
                                        placeholder="Option: enter a question"
                                    />
                                </section>
                            }

                            {(card()! as IAnyCardWithAnswer).answer
                                && card().class !== 'writing-blocks' // because the answer is the same as the question
                                && card().class !== 'multiple-choice'
                                && <TextInput
                                    label={`Answer`}
                                    value={(card() as IAnyCardWithAnswer).answer}
                                    onInput={(e: InputEvent) => setAnswer((e.target as HTMLInputElement).value) as string}
                                    placeholder="Enter answer"
                                />
                            }

                            {"words" in card()
                                && <SelectList
                                    list={words()}
                                    onUpdate={(...args) => onUpdate(setWords, ...args)}
                                />
                            }

                            {"answers" in card()
                                && <AnswerText
                                    answer={answer()}
                                    list={answers()}
                                    onUpdate={(...args) => onUpdate(setAnswers, ...args)}
                                />
                            }

                            {"options" in card()
                                && <AnswerText
                                    answer={answer()}
                                    list={options()}
                                    onUpdate={(...args) => onUpdate(setOptions, ...args)}
                                />
                            }

                            {"vocab" in card()
                                && <VocabText
                                    list={vocab()}
                                    onUpdate={(...args) => onUpdate(setVocab, ...args)}
                                />
                            }

                        </section>

                        <footer class="modal-actions">
                            <button onClick={props.onCancel}>Cancel</button>
                            <button onClick={onSave}>Save</button>
                        </footer>
                    </aside>
                )
            }}
        </Show>
    );
};

export default CardEditor;
