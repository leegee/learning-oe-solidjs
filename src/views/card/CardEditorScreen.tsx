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

    // Lessons derived from the resolved course store
    const lessons = createMemo(() => {
        const cStore = courseStore();
        return cStore?.store.lessons ?? [];
    });

    // Current card derived from lessons, once ready
    const currentCard = createMemo(() => {
        const lIdx = lessonIdx();
        if (typeof lessonIdx === 'undefined' || !lessons().length) {
            return;
        }

        const lesson = lessons()[lIdx];

        if (!lesson || !Array.isArray(lesson.cards)) {
            console.warn("Invalid lesson:", lIdx, lesson);
            return null;
        }

        const cIdx = cardIdx();

        if (cardIdx() >= lesson.cards.length) {
            console.warn('cardId is >= lesson.cards length');
            // Back out of editing cards that don't exist that can occur when user quits editing 
            // and browser auto-opens that tab when restarting
            navigate('/course/' + courseIdx());
            return;
        }

        return lesson.cards[cIdx] ?? null;
    });

    const canRenderEditor = createMemo(() =>
        lessons().length > 0 &&
        lessonIdx() >= 0 &&
        cardIdx() >= 0
        && currentCard() !== null
    );


    // Sync course index into global store once it's ready
    createEffect(() => {
        const cStore = courseStore();
        if (!cStore) return;
        cStore.setCourseIdx(courseIdx());
    });

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

        cStore.setLessons(courseIdx(), updatedLessons)
        navigate(-1);
    };

    return (
        <Show
            when={canRenderEditor() && currentCard()}
            fallback={<p>Loading editor...</p>}
        >
            <article>
                <CardEditor
                    card={currentCard()!}
                    onSave={handleSave}
                    onCancel={() => navigate(`/editor/${courseIdx()}`)}
                />
            </article>
        </Show>
    );
};

export default Editor;
