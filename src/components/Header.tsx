import config from "../config";
import { t } from "../i18n";
import { currentLessonIndex, getTotalLessons } from "../Lessons/state";

interface HeaderProps {
    isLessonActive: boolean;
}

const Header = (props: HeaderProps) => {
    if (props.isLessonActive) {
        return null;
    }

    const lessonIndex = currentLessonIndex();
    const totalLessons = getTotalLessons();

    console.log('...', lessonIndex, totalLessons)

    return (
        <header>
            <div class="header-progress">
                <progress
                    class="course-progress"
                    value={lessonIndex}
                    max={totalLessons}
                    aria-label={t("course_progress")}
                    title={`${t("all_lessons")} ${lessonIndex + 1} / ${totalLessons}`}
                />
            </div>

            <div class="header-text">
                <h1 lang={config.targetLanguage}>{config.target.apptitle}</h1>
                <h2 lang={config.defaultLanguage}>{config.default.apptitle}</h2>
            </div>
        </header>
    );
};

export default Header;
