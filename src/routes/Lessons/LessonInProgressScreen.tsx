import { useParams, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import LessonComponent, { Lesson } from "./Lesson";
import * as state from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";

const LessonInProgressScreen = () => {
    const params = useParams();
    const navigate = useNavigate();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));
    const [lesson, setLesson] = createSignal<Lesson | null>(null);
    const [startTime, setStartTime] = createSignal(Date.now());

    createEffect(() => {
        const lessons = courseStore.store.lessons;
        const idx = lessonIndex();
        const lesson = lessons?.[idx];
        if (lesson) {
            setLesson(lesson);
            setStartTime(Date.now());
        }
    });

    createEffect(() => {
        state.setCourseIndex(courseIndex());
        state.setCurrentLessonIndex(lessonIndex());
    });


    const onCancel = () => {
        navigate(`/course/${courseIndex()}`);
    };

    const onAnswer = (cardIndex: number, incorrectAnswer?: string) => {
        state.saveAnswer(lessonIndex(), cardIndex, incorrectAnswer || '');
    };

    const onLessonComplete = () => {
        const duration = Math.floor((Date.now() - startTime()) / 1000);
        navigate(`/course/${courseIndex()}/${lessonIndex()}/completed?duration=${duration}`);
    };

    return (
        <Show when={lesson()} fallback={<div>Loading Lesson Data...</div>}>
            {(loadedLesson) => (
                <LessonComponent
                    lesson={loadedLesson()}
                    onCancel={onCancel}
                    onAnswer={onAnswer}
                    onLessonComplete={onLessonComplete}
                />
            )}
        </Show>
    );
};

export default LessonInProgressScreen;
