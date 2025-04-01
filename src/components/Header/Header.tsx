import { Show } from "solid-js";
import config from "../../config";
import { t } from "../../i18n";
import Menu from "../Menu";
import { getCurrentLessonIndex, getTotalTakenLessons } from "../../lessons-state";
import { type CourseMetadata } from "../../Course";
import './Header.css';

interface HeaderProps {
    isLessonActive: boolean;
    courseMetadata: CourseMetadata;
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
                    <Show when={props.isLessonActive}>
                        {props.courseMetadata.courseTitle}
                    </Show>
                    <Show when={!props.isLessonActive}>
                        {config.appTitle}
                    </Show>
                    <Menu title={config.appTitle} />
                </h1>
            </div>
        </header>
    );
};

export default Header;
