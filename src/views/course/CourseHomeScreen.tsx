import { createSignal, createEffect, createResource, createMemo, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import Stats from "../../components/Stats";
import { useLessonStore } from "../../global-state/answers";
import { useCourseStore } from "../../global-state/course";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [courseIdx, setCourseIdx] = createSignal<number | null>(null);
    const [courseStore] = createResource(useCourseStore);

    const lessonStore = createMemo(() => {
        const idx = courseIdx();
        if (idx !== null) {
            return useLessonStore(idx);
        }
        return null;
    });

    const courseMetadata = createMemo(() => courseStore()?.store.courseMetadata);

    createEffect(() => {
        console.log("courseMetadata", courseMetadata())
        console.log("courseMetadata 2", courseStore()?.store)
    })

    createEffect(() => {
        const idx = Number(params.courseIdx);
        if (Number.isFinite(idx)) {
            console.log("Course home screen set courseIdx", idx);
            setCourseIdx(idx);
        } else {
            console.log("Course home screen has no courseIdx");
            setCourseIdx(null);
        }
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <Show
            when={!courseStore.loading && courseStore() && lessonStore()}
            fallback={<div>Loading lessons ...</div>}
        >
            <article id="home">
                <Stats courseIdx={courseIdx()!} />

                <LessonList
                    courseIndex={courseIdx()!}
                    onLessonSelected={onLessonSelected}
                >
                    <Show when={courseMetadata()}>
                        <section class="card no-set-height">
                            <h2>{courseMetadata()!.title}</h2>
                            <Show when={courseMetadata()!.description}>
                                <p>{courseMetadata()!.description}</p>
                            </Show>
                        </section>
                    </Show>
                </LessonList>
            </article>
        </Show>
    );
};

export default CourseHome;
