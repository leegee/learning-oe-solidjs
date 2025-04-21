import './LessonIntroScreen.css';
import {
    createEffect,
    createMemo,
    createResource,
    createSignal,
    Show,
} from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useLessonStore } from "../../../global-state/lessons";
import { useCourseStore } from "../../../global-state/course";
import { enterFullscreen } from "../../../lib/fullscreen";
import { useI18n } from "../../../contexts/I18nProvider";

const LessonIntroScreen = () => {
    const [courseStore] = createResource(useCourseStore);
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();
    const lessonStore = useLessonStore();

    const [courseIdx, setCourseIdx] = createSignal(Number(-1));
    const [lessonIdx, setLessonIdx] = createSignal(Number(-1));

    createEffect(() => {
        const cStore = courseStore();
        if (!cStore) {
            return;
        }

        const newCourseIdx = Number(params.courseIdx);
        if (newCourseIdx !== courseIdx()) {
            setCourseIdx(newCourseIdx);
            cStore.setCourseIdx(newCourseIdx);
        }

        const newLessonIdx = Number(params.lessonIdx);
        if (newLessonIdx !== lessonIdx()) {
            setLessonIdx(newLessonIdx);
            lessonStore!.updateLessonIdx(newLessonIdx);
        }
    });

    const lesson = createMemo(() => {
        const store = courseStore();
        if (!store || !store.store) {
            return undefined;
        }
        return store.store.lessons?.[lessonIdx()];
    });

    const handleClick = () => {
        enterFullscreen();
        lessonStore!.resetLesson(lessonIdx());
        navigate(`/course/${courseIdx()}/${lessonIdx()}/in-progress`);
    };

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

                        {loadedLesson().description && (
                            <p class="description">{loadedLesson().description}</p>
                        )}
                    </article>

                    <footer class="lesson-intro-footer">
                        <button class="next-button" onClick={handleClick}>
                            {t('begin')}
                        </button>
                    </footer>
                </>
            )}
        </Show>
    );
};

export default LessonIntroScreen;
