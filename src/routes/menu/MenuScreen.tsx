import './MenuScreen.css';
import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import packageJson from '../../../package.json';
import { courseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/Config";
import ResetCourseButtonComponent from "../../components/ResetCourseButton";
import TitleComponent from "../../components/Menu/Title";
import { useNavigate } from "@solidjs/router";
import CourseEditorButton from "../../components/course-editor/CourseEditorButton";
import { useI18n } from "../../contexts/I18nProvider";

const MenuScreen = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [isOpen, setIsOpen] = createSignal(false);
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);
    const { store } = courseStore;
    const selectedCourseIndex = () => store.selectedCourseIndex;

    onMount(() => {
        setLocalCourseIndex(store.selectedCourseIndex);
    });

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(() => {
            courseStore.setCourseIdx(courseIndex);
            return courseIndex;
        });
        navigate('/course/' + courseIndex);
    };

    createEffect(() => {
        if (selectedCourseIndex() === -1) setIsOpen(true);
    });

    createEffect(() => {
        if (isOpen()) {
            const handleKeys = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    setLocalSelectedCourse(localCourseIndex());
                } else if (e.key === 'Escape') {
                    setIsOpen(false);
                } else if (e.key === 'ArrowDown') {
                    setLocalSelectedCourse(Math.min(localCourseIndex() + 1, config.lessons.length - 1));
                } else if (e.key === 'ArrowUp') {
                    setLocalSelectedCourse(Math.max(localCourseIndex() - 1, 0));
                }
            };

            window.addEventListener('keydown', handleKeys);
            onCleanup(() => window.removeEventListener('keydown', handleKeys));
        }
    });

    createEffect(() => {
        courseStore.setCourseIdx(localCourseIndex());
    });

    return (
        <aside aria-roledescription="Toggle menu" class="hamburger-menu">
            <section class='card'>

                <TitleComponent title={config.appTitle} />

                {selectedCourseIndex() === -1 && <h3>{t('choose_a_course')}</h3>}

                <nav class="course-menu">
                    {config.lessons.map((course, courseIdx) => (
                        <li tabIndex={courseIdx + 1} class={localCourseIndex() === courseIdx ? 'selected' : ''}>
                            <button onClick={() => setLocalSelectedCourse(courseIdx)}>
                                {course.title}
                            </button>

                            {localCourseIndex() === courseIdx &&
                                store.selectedCourseIndex === courseIdx &&
                                store.courseMetadata &&
                                !store.loading && (
                                    <CourseEditorButton courseIdx={courseIdx} />
                                )}
                        </li>
                    ))}

                    <li tabIndex={config.lessons.length + 1}>
                        <ResetCourseButtonComponent />
                    </li>
                </nav>

                <footer>
                    <small>Version {packageJson.version}</small>
                </footer>
            </section>
        </aside>
    );
};

export default MenuScreen;
