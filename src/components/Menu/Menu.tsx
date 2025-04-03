import { createSignal, createEffect } from "solid-js";
import packageJson from '../../../package.json';
import { t } from "i18next";
import { getCourseIndex } from "../../global-state/lessons";
import Course from "../../Course";
import ResetAllButtonComponent from "../ResetAllButton";
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

    return (
        <aside aria-roledescription="Toggle menu" class="menu-container">
            <button class="hamburger-button" onClick={toggleMenu}>
                <span class="hamburger-icon">☰</span>
            </button>

            <div class={`hamburger-menu ${isOpen() ? "open" : ""}`} onClick={closeMenu}>
                <section class='card'>

                    <h1>{props.title}</h1>

                    <div>
                        {getCourseIndex() === -1 && <h2>{t('choose_a_course')}</h2>}
                        <nav>
                            <Course />
                            <li>
                                <ResetAllButtonComponent />
                            </li>
                        </nav>
                    </div>

                    <footer>
                        <button class='next-button'>OK</button>
                        <small>Version {packageJson.version}</small>
                    </footer>
                </section>
            </div>
        </aside>
    );
};

export default Menu;
