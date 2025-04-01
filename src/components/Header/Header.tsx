import config from "../../config";
import { t } from "../../i18n";
import Menu from "../Menu";
import { getCurrentLessonIndex, getTotalTakenLessons } from "../../lessons-state";
import './Header.css';

interface HeaderProps {
    isLessonActive: boolean;
}

const Header = (props: HeaderProps) => {
    if (props.isLessonActive) {
        return null;
    }

    const lessonIndex = getCurrentLessonIndex();
    const totalLessons = getTotalTakenLessons();

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
                    {config.target.apptitle}
                    {/* <Menu /> */}
                </h1>
                <h2 lang={config.defaultLanguage}>{config.default.apptitle}</h2>
            </div>
        </header>
    );
};

export default Header;
