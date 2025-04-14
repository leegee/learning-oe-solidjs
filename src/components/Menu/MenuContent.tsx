// components/Menu/Menu.tsx
import { createSignal, createEffect, onCleanup, onMount } from "solid-js";
import packageJson from '../../../package.json';
import { courseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/Config";
import ResetCourseButtonComponent from "../../routes/Lessons/ResetCourseButton";
import TitleComponent from "./Title";
import './Menu.css';
import { useNavigate } from "@solidjs/router";
import CourseOverviewButton from "../../routes/dashboard/CourseOverviewButton";
import { useI18n } from "../../contexts/I18nProvider";


const MenuContent = () => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [isOpen, setIsOpen] = createSignal(false);
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);
    const { store, setSelectedCourse } = courseStore;
    const selectedCourseIndex = () => store.selectedCourseIndex;

    onMount(() => {
        setLocalCourseIndex(store.selectedCourseIndex);
    });

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(() => {
            setSelectedCourse(courseIndex);
            return courseIndex;
        });
        navigate('/lesson');
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
        setSelectedCourse(localCourseIndex());
    });

    return (
        <aside aria-roledescription="Toggle menu" class="menu-container">
            <div class={`hamburger-menu`}>
                <section class='card'>
                    <TitleComponent title={config.appTitle} />

                    {selectedCourseIndex() === -1 && <h3>{t('choose_a_course')}</h3>}

                    <nav class="course-menu">
                        {config.lessons.map((course, index) => (
                            <li tabIndex={index + 1} class={localCourseIndex() === index ? 'selected' : ''}>
                                <button onClick={() => setLocalSelectedCourse(index)}>
                                    {course.title}
                                </button>

                                {localCourseIndex() === index &&
                                    store.selectedCourseIndex === index &&
                                    store.courseMetadata &&
                                    !store.loading && (
                                        <CourseOverviewButton />
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
            </div>
        </aside>
    );
};

export default MenuContent;
