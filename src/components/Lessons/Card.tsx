import { Switch, Match, JSX } from "solid-js";
import { type ILesson } from "./Lesson";
import { useI18n } from "../../contexts/I18nProvider";
import {
    type IBlanksCard,
    type IDynamicVocabCard,
    type IMultipleChoiceCard,
    type IVocabMatchCard,
    type IWritingBlocksCard,
    type IWritingCard,
    IAnyCard,
    BlanksCardComponent,
    DynamicVocabComponent,
    MultipleChoiceComponent,
    VocabMatchCardComponent,
    WritingBlocksCardComponent,
    WritingCardComponent
} from '../Cards';

type ICardProps = {
    card: IAnyCard | null;
    lesson: ILesson;
    tabindex?: number;
    onComplete?: () => void;
    onCorrect?: () => void;
    onIncorrect?: () => void;
    ondblclick?: JSX.EventHandlerUnion<HTMLDivElement, MouseEvent>;
};

export default function Card(props: ICardProps) {
    const { t } = useI18n();
    return (
        <div
            tabindex={props.tabindex || undefined}
            ondblclick={props.ondblclick}
        >
            <Switch fallback={<p>Unknown lesson card...</p>}>
                <Match when={!props.card}>
                    <p>{t("lesson_complete")}</p>
                </Match>

                <Match when={props.card?.class === "dynamic-vocab"}>
                    <DynamicVocabComponent
                        card={props.card as IDynamicVocabCard}
                        lesson={props.lesson}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>

                <Match when={props.card?.class === "writing"}>
                    <WritingCardComponent
                        card={props.card as IWritingCard}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>

                <Match when={props.card?.class === "writing-blocks"}>
                    <WritingBlocksCardComponent
                        card={props.card as IWritingBlocksCard}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>

                <Match when={props.card?.class === "multiple-choice"}>
                    <MultipleChoiceComponent
                        card={props.card as IMultipleChoiceCard}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>

                <Match when={props.card?.class === "vocab"}>
                    <VocabMatchCardComponent
                        card={props.card as IVocabMatchCard}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>

                <Match when={props.card?.class === "blanks"}>
                    <BlanksCardComponent
                        card={props.card as IBlanksCard}
                        onComplete={props.onComplete ? props.onComplete : () => void (0)}
                        onCorrect={props.onCorrect ? props.onCorrect : () => void (0)}
                        onIncorrect={props.onIncorrect ? props.onIncorrect : () => void (0)}
                    />
                </Match>
            </Switch>
        </div >
    );
}
