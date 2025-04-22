import { useParams, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createResource, createSignal, Show } from "solid-js";
import LessonComponent, { Lesson } from "../../../components/Lessons/Lesson";
import { useCourseStore } from "../../../global-state/course";
import { useLessonStore } from "../../../global-state/lessons";

const LessonInProgressScreen = () => {
    const [courseStore] = createResource(useCourseStore);
    const params = useParams();
    const courseIndex = createMemo(() => Number(params.courseIdx || -1));
    const lessonIndex = createMemo(() => Number(params.lessonIdx || -1));
    const navigate = useNavigate();
    const lessonStore = useLessonStore(courseIndex());

    const [lesson, setLesson] = createSignal<Lesson | null>(null);
    const [startTime, setStartTime] = createSignal(Date.now());

    // Set course/lesson index and load lesson once courseStore is loaded
    createEffect(() => {
        const store = courseStore();
        const courseIdx = courseIndex();
        const lessonIdx = lessonIndex();
        if (store && store.store.lessons && store.store.lessons[lessonIdx]) {
            store.setCourseIdx(courseIdx);
            lessonStore!.updateLessonIdx(courseIdx, lessonIdx);
            setLesson(store.store.lessons[lessonIdx]);
            setStartTime(Date.now());
        }
    });

    const onCancel = () => {
        navigate(`/course/${courseIndex()}`);
    };

    const onAnswer = (cardIndex: number, incorrectAnswer?: string) => {
        lessonStore!.saveAnswer(courseIndex(), lessonIndex(), cardIndex, incorrectAnswer || '');
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
