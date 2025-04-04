import { Show } from "solid-js";
import { useConfigContext } from "../../contexts/Config";
import { t } from "../../i18n";
import Menu from "../Menu";
import { getCurrentLessonIndex, getTotalTakenLessons } from "../../global-state/lessons";
import { type CourseMetadata } from "../../global-state/course";
import './Header.css';

interface HeaderProps {
    isLessonActive: boolean;
    courseMetadata: CourseMetadata;
}


const Header = (props: HeaderProps) => {
    if (props.isLessonActive) {
        return null;
    }
    const { config } = useConfigContext();

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
                </h1>
                <Menu title={config.appTitle} />
            </div>
        </header>
    );
};

export default Header;
