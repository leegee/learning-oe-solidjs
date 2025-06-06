import "./AddCardButton.css";
import { createSignal, Show, For, createResource } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { CARD_CLASSES, createDefaultCard } from "../Cards";
import { useCourseStore, type ICourseStore } from "../../global-state/course";

interface IAddCardButtonProps {
    lessonIdx: number;
}

export default function AddCardButton(props: IAddCardButtonProps) {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();
    const navigate = useNavigate();
    const [showOptions, setShowOptions] = createSignal(false);
    const onAdd = (klass: string) => {
        const store = courseStore();
        if (!store) return;

        const courseIdx = Number(params.courseIdx);
        const lessons = store.getLessons();

        if (!Array.isArray(lessons) || props.lessonIdx < 0 || props.lessonIdx >= lessons.length) {
            console.error("Invalid lesson index or malformed lessons:", lessons, props.lessonIdx);
            return;
        }

        const newCard = createDefaultCard(klass);

        const updatedLessons = lessons.map((lesson, i) =>
            i === props.lessonIdx
                ? { ...lesson, cards: [...lesson.cards, newCard] }
                : lesson
        );

        store.setLessons(updatedLessons);

        const newCardIdx = updatedLessons[props.lessonIdx]?.cards?.length - 1;
        if (newCardIdx == null || newCardIdx < 0) {
            console.error("Failed to calculate newCardIdx");
            return;
        }

        navigate(`/editor/${courseIdx}/${props.lessonIdx}/${newCardIdx}`);
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
