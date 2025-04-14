import { createMemo } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonIntro from "./LessonIntro";
import * as state from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";

const LessonIntroScreen = () => {
    const params = useParams();
    const navigate = useNavigate();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));

    const lesson = createMemo(() => courseStore.store.lessons[lessonIndex()]);

    const startLesson = () => {
        state.resetLesson(lessonIndex());
        navigate(`/course/${courseIndex()}/${lessonIndex()}/in-progress`);
    };

    return (
        <LessonIntro
            title={lesson()?.title}
            description={lesson()?.description}
            index={lessonIndex()}
            onLessonStart={startLesson}
        />
    );
};

export default LessonIntroScreen;
