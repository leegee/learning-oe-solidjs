/* components/Heaeer.tsx */

import config from "../config";
import { t } from "../i18n";

interface HeaderProps {
    isLessonActive: boolean;
    currentLessonIndex: number;
    totalLessons: number;
}

const Header = (props: HeaderProps) => {
    if (props.isLessonActive) return null;

    return (
        <header>
            <div class="header-progress">
                <progress
                    class="course-progress"
                    value={props.currentLessonIndex}
                    max={props.totalLessons}
                    aria-label={t("course_progress")}
                    title={`${t("all_lessons")} ${props.currentLessonIndex + 1} / ${props.totalLessons}`}
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
