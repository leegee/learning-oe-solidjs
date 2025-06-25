import { useParams, useNavigate } from "@solidjs/router";
import { createEffect, createMemo, createResource, createSignal, Show } from "solid-js";
import LessonComponent, { ILesson } from "../../../components/Lessons/Lesson";
import { useCourseStore, type ICourseStore } from "../../../global-state/course";
import { useLessonStore } from "../../../global-state/answers";

const LessonInProgressScreen = () => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();
    const courseIndex = createMemo(() => Number(params.courseIdx || -1));
    const lessonIndex = createMemo(() => Number(params.lessonIdx || -1));
    const navigate = useNavigate();
    const lessonStore = useLessonStore(courseIndex());

    const [lesson, setLesson] = createSignal<ILesson | null>(null);
    const [startTime, setStartTime] = createSignal(Date.now());

    createEffect(() => {
        if (courseStore.loading) return;
        const store = courseStore();
        if (!store) return;
        const lessonIdx = lessonIndex();
        const lessons = store?.getLessons();
        if (lessons[lessonIdx]) {
            setLesson(lessons[lessonIdx]);
            setStartTime(Date.now());
        }
    });

    const onCancel = () => {
        navigate(`/course/${courseIndex()}`);
    };

    const onAnswer = (cardIndex: number, incorrectAnswer?: string) => {
        lessonStore!.saveAnswer(lessonIndex(), cardIndex, incorrectAnswer || '');
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
