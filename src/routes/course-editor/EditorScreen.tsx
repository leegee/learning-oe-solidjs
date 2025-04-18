// EditorScreen.tsx
import { useNavigate, useParams } from "@solidjs/router";
import { createEffect, createMemo, createResource, Show } from "solid-js";
import CardEditor from "../../components/CardEditor/CardEditor";
import { useCourseStore } from "../../global-state/course";
import { IAnyCard } from "../../components/Cards";

const Editor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [courseStore] = createResource(useCourseStore);

    const courseIdx = () => Number(params.courseIdx ?? -1);
    const lessonIdx = () => Number(params.lessonIdx ?? -1);
    const cardIdx = () => Number(params.cardIdx ?? -1);

    // Sync course index into global store once it's ready
    createEffect(() => {
        const cStore = courseStore();
        if (!cStore) return;
        cStore.setCourseIdx(courseIdx());
    });

    // Lessons derived from the resolved course store
    const lessons = createMemo(() => {
        const cStore = courseStore();
        return cStore?.store.lessons ?? [];
    });

    // Current card derived from lessons, once ready
    const currentCard = createMemo(() => {
        const lIdx = lessonIdx();
        const cIdx = cardIdx();
        const lesson = lessons()[lIdx];

        if (!lesson || !Array.isArray(lesson.cards)) {
            console.log("Invalid lesson:", lIdx, lesson);
            return null;
        }

        return lesson.cards[cIdx] ?? null;
    });

    createEffect(() => {
        console.log("Lessons length:", lessons().length);
        console.log("lessonIdx:", lessonIdx(), "cardIdx:", cardIdx());
        console.log("Current card:", currentCard());
    });

    const canRenderEditor = createMemo(() =>
        lessons().length > 0 &&
        lessonIdx() >= 0 &&
        cardIdx() >= 0 &&
        !!currentCard()
    );

    const handleSave = (updatedCard: IAnyCard) => {
        const cStore = courseStore();
        if (!cStore) return;

        const updatedLessons = cStore.store.lessons.map((lesson, lIdx) =>
            lIdx === lessonIdx()
                ? {
                    ...lesson,
                    cards: lesson.cards.map((card, cIdx) =>
                        cIdx === cardIdx() ? updatedCard : card
                    ),
                }
                : lesson
        );

        cStore.store.lessons = updatedLessons;
        navigate(-1);
    };

    return (
        <Show
            when={canRenderEditor()}
            fallback={
                <div>
                    <p>Loading editor...</p>
                    <p>
                        lessons: {lessons().length}, courseIdx: {courseIdx()}, lessonIdx: {lessonIdx()}, cardIdx: {cardIdx()}
                    </p>
                </div>
            }
        >
            <article>
                <CardEditor
                    card={currentCard()}
                    onSave={handleSave}
                    onCancel={() => navigate(`/editor/${courseIdx()}`)}
                />
            </article>
        </Show>
    );
};

export default Editor;
