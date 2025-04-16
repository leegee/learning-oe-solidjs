import './LessonIntroScreen.css';
import { createEffect, createMemo, createSignal, Show } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useLessonStore } from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";
import { enterFullscreen } from "../../lib/fullscreen";
import { useI18n } from "../../contexts/I18nProvider";

const LessonIntroScreen = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();
    const lessonStore = useLessonStore();

    const [courseIdx, setCourseIdx] = createSignal(Number(-1));
    const [lessonIdx, setLessonIdx] = createSignal(Number(-1));

    createEffect(() => {
        const newcourseIdx = Number(params.courseIdx);
        if (newcourseIdx !== courseIdx()) {
            setCourseIdx(newcourseIdx);
            courseStore.setCourseIdx(newcourseIdx);
        }

        const newLessonIdx = Number(params.courseIdx);
        if (newLessonIdx !== lessonIdx()) {
            setLessonIdx(newLessonIdx);
            lessonStore.updateLessonIdx(newLessonIdx);
        }
    });

    const lesson = createMemo(() => courseStore.store.lessons[lessonIdx()]);

    const handleClick = () => {
        enterFullscreen();
        lessonStore.resetLesson(lessonIdx());
        navigate(`/course/${courseIdx()}/${lessonIdx()}/in-progress`);

    }
    return (
        <Show when={lesson()} fallback={<div>Loading Lesson Data...</div>}>
            {(loadedLesson) => (
                <>
                    <article class="lesson-intro card">
                        <header>
                            <h2>
                                {t('lesson')} {lessonIdx() + 1}
                            </h2>
                            <h3>{loadedLesson().title}</h3>
                        </header>

                        {lesson().description && (<p class="description">{loadedLesson().description}</p>)}
                    </article >

                    <footer class="lesson-intro-footer">
                        <button class='next-button' onClick={handleClick}>
                            {t('begin')}
                        </button>
                    </footer>
                </>
            )}
        </Show>
    );
};

export default LessonIntroScreen;
