import { useNavigate, useParams } from "@solidjs/router";
import EditCardModal from "../../components/CardEditor/CardEditor";
import { createEffect, createResource, createSignal, Show } from "solid-js";
import { Lesson } from "../../components/Lessons/Lesson";
import { useCourseStore } from "../../global-state/course";
import { persist } from "../../components/CourseEditor/CourseEditor";

const Editor = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [lessons, setLessons] = createSignal<Lesson[]>([]);
    const [courseStore] = createResource(useCourseStore);

    const [courseIdx, setCourseIdx] = createSignal<number>(-1);
    const [lessonIdx, setLessonIdx] = createSignal<number>(-1);
    const [cardIdx, setCardIdx] = createSignal<number>(-1);

    createEffect(() => {
        const cStore = courseStore();
        if (cStore && !courseStore.loading) {
            const { store, setCourseIdx: setStoreCourseIdx } = cStore;

            setCourseIdx(Number(params.courseIdx ?? -1));
            setLessonIdx(Number(params.lessonIdx ?? -1));
            setCardIdx(Number(params.cardIdx ?? -1));

            setStoreCourseIdx(courseIdx());

            if (store.lessons) {
                console.log("set lessons");
                setLessons(store.lessons);
            }

            console.log("done courseIdx");
        }
    });

    return (
        <Show
            when={lessons()?.length && lessonIdx() >= 0 && cardIdx() >= 0}
            fallback={
                <div>
                    Loading editor...<sup>{lessons()?.length ?? 'null'} {courseIdx()} {lessonIdx()} {cardIdx()}</sup>
                </div>
            }
        >
            <article>
                {lessons()[lessonIdx()]?.cards[cardIdx()] && (
                    <EditCardModal
                        card={lessons()[lessonIdx()]?.cards[cardIdx()]}
                        onSave={(updatedCard: any) => {
                            const data = [...lessons()];
                            data[lessonIdx()].cards[cardIdx()] = updatedCard;
                            setLessons(data);
                            persist(data);
                            navigate(-1);
                        }}
                        onCancel={() => navigate(`/editor/${courseIdx()}`)}
                    />
                )}
            </article>
        </Show>
    );
};

export default Editor;
