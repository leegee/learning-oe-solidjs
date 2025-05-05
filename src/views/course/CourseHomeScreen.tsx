import {
    createSignal,
    createEffect,
    createResource,
    Show,
} from "solid-js";
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
    const [lessonStore, setLessonStore] = createSignal<ReturnType<typeof useLessonStore> | null>(null);

    createEffect(() => {
        const idx = Number(params.courseIdx);
        if (Number.isFinite(idx)) {
            setCourseIdx(idx);
        } else {
            setCourseIdx(null);
        }
    });

    createEffect(() => {
        if (courseStore.loading) return;
        const store = courseStore();
        if (!store || courseIdx === null) return;
        setLessonStore(useLessonStore(courseIdx()!));
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <Show
            when={!courseStore.loading && courseStore() && lessonStore() && courseIdx()}
            fallback={<div>Loading lessons ...</div>}
        >
            <article id="home">
                {(() => {
                    const store = courseStore()!;
                    const metadata = store.store.courseMetadata;

                    return (
                        <>
                            <Stats courseIdx={courseIdx()!} />

                            <LessonList
                                courseIndex={courseIdx()!}
                                onLessonSelected={onLessonSelected}
                            >
                                <Show when={metadata}>
                                    <section class="card no-set-height">
                                        <h2>{metadata!.title}</h2>
                                        <Show when={metadata!.description}>
                                            <p>{metadata!.description}</p>
                                        </Show>
                                    </section>
                                </Show>
                            </LessonList>
                        </>
                    );
                })()}
            </article>
        </Show>

    );
};

export default CourseHome;
