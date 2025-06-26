import './Header.css';
import { createMemo, createResource, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { type ICourseStore, useCourseStore } from '../../global-state/course';
import MenuTogglebutton from "../Menu/MenuToggleButton";
import { useConfigContext } from "../../contexts/ConfigProvider";
import { useLessonStore } from "../../global-state/answers";
import { useI18n } from "../../contexts/I18nProvider";

const Header = () => {
    const { t } = useI18n();
    const { config } = useConfigContext();
    const params = useParams();

    const courseIdx = createMemo(() => Number(params.courseIdx || -1));
    const lessonStore = createMemo(() => useLessonStore(courseIdx()));
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    const lessonIndex = createMemo(() => lessonStore().getTotalQuestionsAnswered());
    const totalLessons = createMemo(() => courseStore()?.getTotalLessonsCount() ?? 0);

    return (
        <Show when={courseStore()} fallback={<p>Loading...</p>}>
            <header class='header-component'>
                <aside class="header-progress">
                    <progress
                        class="course-progress-bar"
                        value={lessonIndex()}
                        max={totalLessons()}
                        aria-label={t("course_progress")}
                        title={`${t("all_lessons")} ${lessonIndex() + 1} / ${totalLessons()}`}
                    />
                </aside>

                <div class="header-text">
                    <h1 lang={config.targetLanguage}>{config.appTitle}</h1>
                    <MenuTogglebutton />
                </div>
            </header>
        </Show>
    );
};

export default Header;
