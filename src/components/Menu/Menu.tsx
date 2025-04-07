import { createSignal, createEffect, onCleanup } from "solid-js";
import packageJson from '../../../package.json';
import { t } from "i18next";
import { getCourseIndex } from "../../global-state/lessons";
import Course from "../../Course";
import ResetCourseButtonComponent from "../ResetCourseButton";
import TitleComponent from "./Title";
import './Menu.css';

interface MenuProps {
    title: string;
}

const Menu = (props: MenuProps) => {
    const [isOpen, setIsOpen] = createSignal(false);

    const closeMenu = () => {
        if (getCourseIndex() > -1) {
            setIsOpen(false);
        }
    }

    const toggleMenu = () => {
        if (getCourseIndex() > -1) {
            setIsOpen(prev => !prev);
        }
    }

    createEffect(() => {
        if (getCourseIndex() === -1) {
            setIsOpen(true);
        }
    });

    createEffect(() => {
        if (isOpen()) {
            const handleKeys = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape') {
                    setIsOpen(false);
                }
            };

            window.addEventListener('keyup', handleKeys);
            onCleanup(() => window.removeEventListener('keyup', handleKeys));
        }
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

                    <nav>
                        <Course />
                        <li>
                            <ResetCourseButtonComponent />
                        </li>
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
