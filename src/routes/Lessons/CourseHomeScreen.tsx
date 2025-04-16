import { createSignal, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import HomeScreen from "./HomeScreen";
import Stats from "../../components/Stats";
import * as state from "../../global-state/lessons";

const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [courseIdx, setCourseIdx] = createSignal(Number(-1));

    createEffect(() => {
        const newCourseIndex = Number(params.courseIdx);
        if (newCourseIndex !== courseIdx()) {
            setCourseIdx(newCourseIndex);
            state.setCourseIdx(newCourseIndex);
        }
    });

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${courseIdx()}/${lessonIndex}/intro`);
    };

    return (
        <HomeScreen>
            <Stats />
            <LessonList
                courseIndex={courseIdx()}
                currentLessonIndex={state.getLessonIdx()}
                onLessonSelected={onLessonSelected}
            />
        </HomeScreen>
    );
};

export default CourseHome;
