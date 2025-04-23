import "./AddCardButton.css";
import { createSignal, Show, For, createResource } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { CARD_CLASSES, createDefaultCard } from "../Cards";
import { useCourseStore, type ICourseStore } from "../../global-state/course";

interface IAddCardButtonProps {
}

export default function AddCardButton(props: IAddCardButtonProps) {
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    const params = useParams();
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = createSignal(false);

    const onAdd = (klass: string) => {
        const newCard = createDefaultCard(klass);
        const updatedLessons = courseStore()!.lessons().map((lesson, i) =>
            i === Number(params.lessonIdx)
                ? { ...lesson, cards: [...lesson.cards, newCard] }
                : lesson
        );

        courseStore()!.setLessons(Number(params.courseIdx), updatedLessons);

        const newCardIdx = updatedLessons[Number(params.lessonIdx)].cards.length - 1;

        navigate(`/editor/${params.courseIdx}/${Number(params.lessonIdx)}/${newCardIdx}`);
    };

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <div class='add-card' >
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
                                        onAdd(type);
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
        </Show>
    );
}
