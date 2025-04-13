import { createSignal, createEffect, onCleanup } from "solid-js";

import packageJson from '../../../package.json';
import { courseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/Config";
import { t } from "i18next";
import { getCourseIndex, setCourseIndex } from "../../global-state/lessons";
import ResetCourseButtonComponent from "../ResetCourseButton";
import TitleComponent from "./Title";
import CourseOverview from "../CourseOverview";
import './Menu.css';

interface MenuProps {
    title: string;
}


const Menu = (props: MenuProps) => {
    const { config } = useConfigContext();
    const [isOpen, setIsOpen] = createSignal(false);
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);

    createEffect(async () => {
        const index = await getCourseIndex();
        setLocalCourseIndex(index);
    });

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(courseIndex);
        courseStore.setSelectedCourse(courseIndex);
        setCourseIndex(courseIndex);
    }

    const closeMenu = () => {
        if (getCourseIndex() > -1) {
            setIsOpen(false);
        }
    };

    const toggleMenu = () => {
        if (getCourseIndex() > -1) {
            setIsOpen(prev => !prev);
        }
    };

    createEffect(() => {
        if (getCourseIndex() === -1) {
            setIsOpen(true);
        }
    });

    createEffect(() => {
        if (isOpen()) {
            const handleKeys = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    setLocalSelectedCourse(localCourseIndex());
                } if (e.key === 'Escape') {
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
        // Sync the localCourseIndex with the global state when it changes
        setCourseIndex(localCourseIndex());
    });

    return (
        <aside aria-roledescription="Toggle menu" class="menu-container">
            <button class="hamburger-button" onClick={toggleMenu}>
                <span class="hamburger-icon">☰</span>
            </button>

            <div class={`hamburger-menu ${isOpen() ? "open" : ""}`} onClick={closeMenu}>
                <section class='card'>

                    <div class="close-menu-button">✕</div>

                    <TitleComponent title={props.title} />

                    {getCourseIndex() === -1 && <h3>{t('choose_a_course')}</h3>}

                    <nav class="nav-selected-with-highlight">
                        {config.lessons.map((course, index) => (
                            <li class={localCourseIndex() === index ? 'selected' : ''}>
                                <button onClick={() => setLocalSelectedCourse(index)}>
                                    {course.title}
                                </button>
                            </li>
                        ))}

                        <li>
                            <ResetCourseButtonComponent />
                        </li>

                        {!courseStore.store.loading
                            && <li>
                                <CourseOverview lessons={courseStore.store.lessons} courseMetadata={courseStore.store.courseMetadata!} />
                            </li>
                        }
                    </nav>

                    <footer>
                        {getCourseIndex() > -1 && <button class='next-button' aria-label="Return to lessons">▶</button>}
                        <small>Version {packageJson.version}</small>
                    </footer>
                </section>
            </div>
        </aside>
    );
};

export default Menu;
