import { createSignal, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "./LessonList";
import HomeScreen from "./HomeScreen";
import Stats from "./Stats";
import * as state from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();

    // Signal to track courseIndex reactively
    const [courseIdx, setCourseIdx] = createSignal(Number(-1));
    const [lessonIdx, setLessonIdx] = createSignal(Number(-1));

    // React to changes in the route parameters
    createEffect(() => {
        const newCourseIndex = Number(params.courseIdx);
        if (newCourseIndex !== courseIdx()) {
            setCourseIdx(newCourseIndex);
            state.setCourseIndex(newCourseIndex);
        }

        const newLessonIdx = Number(params.courseIdx);
        if (newLessonIdx !== lessonIdx()) {
            setCourseIdx(newLessonIdx);
            setLessonIdx(newLessonIdx);
            state.setCurrentLessonIndex(newLessonIdx);
        }
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <HomeScreen>
            <Stats />
            <LessonList
                courseMetadata={courseStore.store.courseMetadata!}
                currentLessonIndex={lessonIdx()}
                lessons={courseStore.lessonTitles2Indicies()}
                onLessonSelected={onLessonSelected}
            />
        </HomeScreen>
    );
};

export default CourseHome;
