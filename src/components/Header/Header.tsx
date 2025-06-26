import './Header.css';
import { createResource, Show } from 'solid-js';
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
    const lessonStore = useLessonStore(Number(params.courseIdx || -1));
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    return (
        <Show when={courseStore()} fallback={<p>Loading...</p>}>
            {(store) => {
                const lessonIndex = lessonStore.getTotalQuestionsAnswered();
                const totalLessons = store().getTotalLessonsCount();
                return (
                    <header class='header-component'>
                        <aside class="header-progress">
                            <progress
                                class="course-progress-bar"
                                value={lessonIndex}
                                max={totalLessons}
                                aria-label={t("course_progress")}
                                title={`${t("all_lessons")} ${lessonIndex + 1} / ${totalLessons}`}
                            />
                        </aside>

                        <div class="header-text">
                            <h1 lang={config.targetLanguage}>{config.appTitle}</h1>
                            <MenuTogglebutton />
                        </div>
                    </header>
                )
            }}
        </Show>
    );
};

export default Header;
