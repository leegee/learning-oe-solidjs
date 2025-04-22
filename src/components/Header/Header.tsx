import './Header.css';
import MenuTogglebutton from "../Menu/MenuToggleButton";
import { useConfigContext } from "../../contexts/ConfigProvider";
import { useLessonStore } from "../../global-state/lessons";
import { useI18n } from "../../contexts/I18nProvider";

export interface IHeaderProps {
    courseIdx: number;
}

const Header = (props: IHeaderProps) => {
    const { t } = useI18n();
    const { config } = useConfigContext();
    const lessonStore = useLessonStore(props.courseIdx);

    // todo stats
    const lessonIndex = lessonStore!.getTotalCorrectAnswers();
    const totalLessons = lessonStore!.getTotalQuestionsAnswered();

    return (
        <header class='header-component'>
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
