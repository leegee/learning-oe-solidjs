import './Header.css';
import { useConfigContext } from "../../contexts/ConfigProvider";
import MenuTogglebutton from "../Menu/MenuToggleButton";
import { useLessonStore } from "../../global-state/lessons";
import { useI18n } from "../../contexts/I18nProvider";

const Header = () => {
    const { t } = useI18n();
    const { config } = useConfigContext();
    const lessonStore = useLessonStore();

    // todo stats
    const lessonIndex = lessonStore.getTotalCorrectAnswers();
    const totalLessons = lessonStore.getTotalQuestionsAnswered();

    return (
        <header>
            <aside class="header-progress">
                <progress
                    class="course-progress"
                    value={lessonIndex}
                    max={totalLessons}
                    aria-label={t("course_progress")}
                    title={`${t("all_lessons")} ${lessonIndex + 1} / ${totalLessons}`}
                />
            </aside>

            <div class="header-text">
                <h1 lang={config.targetLanguage}>
                    {config.appTitle}
                </h1>
                <MenuTogglebutton />
            </div>
        </header>
    );
};

export default Header;
