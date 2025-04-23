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

    const [courseStore] = createResource(() => useCourseStore());
    const [lessonStore, setLessonStore] = createSignal<ReturnType<typeof useLessonStore> | null>(null);

    // Watch for route param changes
    createEffect(() => {
        const newIdx = Number(params.courseIdx);
        if (!Number.isNaN(newIdx) && newIdx !== courseIdx()) {
            setCourseIdx(newIdx);
        }
    });

    // Sync courseStore and update lessonStore
    createEffect(() => {
        if (courseStore.loading) return;

        const cs = courseStore();
        const idx = courseIdx();
        if (!cs) return;

        if (cs.getCourseIdx() !== idx) {
            cs.setCourseIdx(idx);
        }

        setLessonStore(useLessonStore(idx));
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
                <Stats courseIdx={courseIdx()} />
                <LessonList
                    lessons={courseStore()!.store.lessons}
                    courseIndex={courseIdx()}
                    currentLessonIndex={lessonStore()!.lessonIndex}
                    onLessonSelected={onLessonSelected}
                />
            </article>
        </Show>
    );
};

export default CourseHome;
