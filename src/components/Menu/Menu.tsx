import { createSignal, createEffect, onCleanup, onMount } from "solid-js";

import packageJson from '../../../package.json';
import { courseStore } from "../../global-state/course";
const { store, setSelectedCourse } = courseStore;
import { useConfigContext } from "../../contexts/Config";
import { t } from "i18next";
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
    const selectedCourseIndex = () => store.selectedCourseIndex;

    onMount(() => {
        setLocalCourseIndex(store.selectedCourseIndex);
    });

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(_ => {
            setSelectedCourse(courseIndex); // includes setCourseIndex(courseIndex);
            return courseIndex;
        });
    };

    const closeMenu = () => {
        if (selectedCourseIndex() > -1) {
            setIsOpen(false);
        }
    };

    const toggleMenu = () => {
        if (selectedCourseIndex() > -1) {
            setIsOpen(prev => !prev);
        }
    };

    createEffect(() => {
        if (selectedCourseIndex() === -1) {
            setIsOpen(true);
        }
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
            <button class="hamburger-button" onClick={toggleMenu}>
                <span class="hamburger-icon">☰</span>
            </button>

            <div class={`hamburger-menu ${isOpen() ? "open" : ""}`} onClick={closeMenu}>
                <section class='card'>

                    <div class="close-menu-button">✕</div>

                    <TitleComponent title={props.title} />

                    {selectedCourseIndex() === -1 && <h3>{t('choose_a_course')}</h3>}

                    <nav class="nav-selected-with-highlight">
                        {config.lessons.map((course, index) => (
                            <li tabIndex={index + 1} class={localCourseIndex() === index ? 'selected' : ''}>
                                <button onClick={() => setLocalSelectedCourse(index)}>
                                    {course.title}
                                </button>

                                {localCourseIndex() === index
                                    && store.selectedCourseIndex === index
                                    && store.courseMetadata
                                    && !store.loading
                                    && <CourseOverview
                                        lessons={store.lessons}
                                        courseMetadata={store.courseMetadata}
                                    />}

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

export default Menu;
