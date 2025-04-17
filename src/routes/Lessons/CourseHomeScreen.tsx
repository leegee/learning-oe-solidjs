import { createSignal, createEffect, createResource, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import HomeScreen from "./HomeScreen";
import Stats from "../../components/Stats";
import { useLessonStore } from "../../global-state/lessons";
import { useCourseStore } from "../../global-state/course";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [lessonStore] = createResource(useLessonStore);
    const [courseStore] = createResource(useCourseStore);

    const [courseIdx, setCourseIdx] = createSignal(-1);

    createEffect(() => {
        const cStore = courseStore();
        if (!cStore) {
            return;
        }

        const newCourseIndex = Number(params.courseIdx);
        if (newCourseIndex !== cStore.store.selectedCourseIndex) {
            cStore.setCourseIdx(newCourseIndex);
            setCourseIdx(newCourseIndex);
        }
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <HomeScreen>
            <Show when={courseStore() && lessonStore()}>
                <Stats />
                <LessonList
                    courseIndex={courseIdx()}
                    currentLessonIndex={lessonStore()?.lessonIndex ?? 0}
                    onLessonSelected={onLessonSelected}
                />
            </Show>
            <Show when={!courseStore() || !lessonStore()}>
                <div>Loading lessons ...</div>
            </Show>
        </HomeScreen>
    );
};

export default CourseHome;
