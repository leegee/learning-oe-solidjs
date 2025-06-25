import { createSignal, createEffect, createResource, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import Stats from "../../components/Stats";
import { useLessonStore } from "../../global-state/answers";
import { useCourseStore } from "../../global-state/course";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [lessonStore, setLessonStore] = createSignal<ReturnType<typeof useLessonStore> | null>(null);
    const [courseIdx, setCourseIdx] = createSignal<number | null>(null);
    const [courseStore] = createResource(useCourseStore);
    const [courseMetadata, setCourseMetadata] = createSignal<any | null>(null);

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

    createEffect(() => {
        if (courseStore() && !courseStore.loading) {
            const idx = courseIdx();
            if (idx !== null) {
                const metadata = courseStore()?.store.courseMetadata;
                setCourseMetadata(metadata);
            }
        }
    });

    createEffect(() => {
        const idx = courseIdx();
        if (idx !== null) {
            console.log("Creating lessonStore for courseIdx", idx);
            setLessonStore(useLessonStore(idx));
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
                        <section class="card no-border no-set-height">
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
