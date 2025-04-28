import {
    createSignal,
    createEffect,
    createResource,
    Show,
} from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import Stats from "../../components/Stats";
import { useLessonStore } from "../../global-state/lessons";
import { useCourseStore } from "../../global-state/course";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();
    const [courseIdx, setCourseIdx] = createSignal(Number(params.courseIdx));

    const [courseStore] = createResource(useCourseStore);
    const [lessonStore, setLessonStore] = createSignal<ReturnType<typeof useLessonStore> | null>(null);

    createEffect(() => {
        const newIdx = Number(params.courseIdx);
        if (!Number.isNaN(newIdx) && newIdx !== courseIdx()) {
            setCourseIdx(newIdx);
        }
    });

    createEffect(() => {
        if (courseStore.loading) return;
        const store = courseStore();
        if (!store) return;
        setLessonStore(useLessonStore(courseIdx()));
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
                {(() => {
                    const store = courseStore()!;
                    const lesson = lessonStore()!;
                    const metadata = store.store.courseMetadata;

                    return (
                        <>
                            <Stats courseIdx={courseIdx()} />

                            <LessonList
                                courseIndex={courseIdx()}
                                onLessonSelected={onLessonSelected}
                            >
                                <Show when={metadata}>
                                    <section class="card no-set-height">
                                        <h2>{metadata!.courseTitle}</h2>
                                        <p>{metadata!.description}</p>
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
