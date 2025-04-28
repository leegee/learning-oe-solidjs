import './LessonIntroScreen.css';

import { createMemo, createResource, Show, } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";

import { useLessonStore } from "../../../global-state/answers";
import { useCourseStore, type ICourseStore } from "../../../global-state/course";
import { enterFullscreen } from "../../../lib/fullscreen";
import { useI18n } from "../../../contexts/I18nProvider";

const LessonIntroScreen = () => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();
    const navigate = useNavigate();
    const { t } = useI18n();

    const courseIdx = createMemo(() => Number(params.courseIdx));
    const lessonIdx = createMemo(() => Number(params.lessonIdx));

    const lessonStore = createMemo(() => useLessonStore(courseIdx()));

    const lesson = createMemo(() => {
        const store = courseStore();
        if (!store || !store.store) return undefined;
        return store.getLessons()?.[lessonIdx()];
    });

    const handleClick = () => {
        enterFullscreen();
        lessonStore()?.resetLesson(lessonIdx());
        navigate(`/course/${courseIdx()}/${lessonIdx()}/in-progress`);
    };

    return (
        <Show when={lesson()} fallback={<div>Loading Lesson Data...</div>}>
            {(loadedLesson) => (
                <>
                    <article class="lesson-intro card">
                        <header>
                            <h2>{t('lesson')} {lessonIdx() + 1}</h2>
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
