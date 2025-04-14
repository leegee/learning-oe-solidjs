import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import LessonIntro from "./LessonIntro";
import * as state from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";

const LessonIntroScreen = () => {
    const params = useParams();
    const navigate = useNavigate();

    const [courseIdx, setCourseIdx] = createSignal(Number(-1));
    const [lessonIdx, setLessonIdx] = createSignal(Number(-1));

    // React to changes in the route parameters
    createEffect(() => {
        const newcourseIdx = Number(params.courseIdx);
        if (newcourseIdx !== courseIdx()) {
            setCourseIdx(newcourseIdx);
            state.setCourseIndex(newcourseIdx);
        }

        const newLessonIdx = Number(params.courseIdx);
        if (newLessonIdx !== lessonIdx()) {
            setCourseIdx(newLessonIdx);
            setLessonIdx(newLessonIdx);
            state.setCurrentLessonIndex(newLessonIdx);
        }
    });

    const lesson = createMemo(() => courseStore.store.lessons[lessonIdx()]);

    const startLesson = () => {
        state.resetLesson(lessonIdx());
        navigate(`/course/${courseIdx()}/${lessonIdx()}/in-progress`);
    };

    return (
        <Show when={lesson()} fallback={<div>Loading Lesson Data...</div>}>
            {(l) => (
                <LessonIntro
                    title={lesson()?.title}
                    description={lesson()?.description}
                    index={lessonIdx()}
                    onLessonStart={startLesson}
                />
            )}
        </Show>
    );
};

export default LessonIntroScreen;
