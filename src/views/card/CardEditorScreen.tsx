// EditorScreen.tsx
import { useNavigate, useParams } from "@solidjs/router";
import { createMemo, createEffect, Show } from "solid-js";
import CardEditor from "../../components/CardEditor/CardEditor";
import { getCourseStore } from "../../global-state/course";
import { IAnyCard } from "../../components/Cards";

const Editor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const courseStore = getCourseStore();

    const courseIdx = () => Number(params.courseIdx ?? -1);
    const lessonIdx = () => Number(params.lessonIdx ?? -1);
    const cardIdx = () => Number(params.cardIdx ?? -1);

    // Lessons derived from the resolved course store
    const lessons = createMemo(() => {
        return courseStore?.getLessons() ?? [];
    });

    // Current card derived from lessons, once ready
    const currentCard = createMemo(() => {
        const lIdx = lessonIdx();
        if (typeof lIdx === "undefined" || !lessons().length) {
            return;
        }

        const lesson = lessons()[lIdx];

        if (!lesson || !Array.isArray(lesson.cards)) {
            console.warn("Invalid lesson:", lIdx, lesson);
            return null;
        }

        const cIdx = cardIdx();

        if (cIdx >= lesson.cards.length) {
            console.warn("cardId is >= lesson.cards length");
            // Back out of editing cards that don't exist that can occur when user quits editing 
            // and browser auto-opens that tab when restarting
            navigate("/course/" + courseIdx());
            return;
        }

        return lesson.cards[cIdx] ?? null;
    });

    const canRenderEditor = createMemo(
        () =>
            lessons().length > 0 &&
            lessonIdx() >= 0 &&
            cardIdx() >= 0 &&
            currentCard() !== null
    );

    // Sync course index into global store once it's ready
    createEffect(() => {
        if (!courseStore) return;
        // You can add syncing logic here if needed
    });

    const onSave = (updatedCard: IAnyCard) => {
        if (!courseStore) return;
        courseStore.saveCard(updatedCard, lessonIdx(), cardIdx());
        navigate(-1);
    };

    return (
        <Show when={canRenderEditor() && currentCard()} fallback={<p>Loading editor...</p>}>
            <article>
                <CardEditor
                    card={currentCard()!}
                    onSave={onSave}
                    onCancel={() => navigate(`/editor/${courseIdx()}`)}
                />
            </article>
        </Show>
    );
};

export default Editor;
