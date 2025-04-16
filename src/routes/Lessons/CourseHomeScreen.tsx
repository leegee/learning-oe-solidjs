import { createSignal, createEffect } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonList from "../../components/Lessons/LessonList";
import HomeScreen from "./HomeScreen";
import Stats from "../../components/Stats";
import { useLessonStore } from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";


const CourseHome = () => {
    const params = useParams();
    const navigate = useNavigate();
    const lessonStore = useLessonStore();
    const [courseIdx, setCourseIdx] = createSignal(Number(-1));

    createEffect(() => {
        const newCourseIndex = Number(params.courseIdx);
        if (newCourseIndex !== courseIdx()) {
            setCourseIdx(newCourseIndex);
            courseStore.setCourseIdx(newCourseIndex);
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
                currentLessonIndex={lessonStore.lessonIndex}
                onLessonSelected={onLessonSelected}
            />
        </HomeScreen>
    );
};

export default CourseHome;
