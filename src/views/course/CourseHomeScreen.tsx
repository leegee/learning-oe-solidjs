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
import { useCourseStore, type ICourseStore } from "../../global-state/course";

const CourseHome = () => {
    let lessonStore;
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    const params = useParams();
    const navigate = useNavigate();
    const [courseIdx, setCourseIdx] = createSignal(Number(params.courseIdx));

    // Update courseIdx if route changes
    createEffect(() => {
        const newIdx = Number(params.courseIdx);
        if (!Number.isNaN(newIdx) && newIdx !== courseIdx()) {
            setCourseIdx(newIdx);
        }
    });

    // When courseStore is loaded or courseIdx changes, update store
    createEffect(() => {
        if (courseStore.loading) return;
        const idx = courseIdx();
        if (courseStore()!.getCourseIdx() !== idx) {
            courseStore()!.setCourseIdx(idx);
        }
        lessonStore = useLessonStore(idx);
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <Show
            when={!courseStore.loading && lessonStore}
            fallback={<div>Loading lessons ...</div>}
        >
            <article id="home">
                <Stats courseIdx={courseIdx()} />
                <LessonList
                    lessons={courseStore()?.store.lessons || []}
                    courseIndex={courseIdx()}
                    currentLessonIndex={lessonStore!.lessonIndex ?? 0}
                    onLessonSelected={onLessonSelected}
                />
            </article>
        </Show>
    );
};

export default CourseHome;
