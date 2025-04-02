import { createSignal } from "solid-js";
import Course from "../../Course";
import ResetAllButtonComponent from "../ResetAllButton";
import AboutComponent from "../About";
import './Menu.css';

interface MenuProps {
    title: string;
}

const Menu = (props: MenuProps) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <aside aria-roledescription="Toggle menu" class="menu-container">
            <button class="hamburger-button" onClick={toggleMenu}>
                <span class="hamburger-icon">☰</span>
            </button>

            <div class={`hamburger-menu ${isOpen() ? "open" : ""}`} onClick={closeMenu}>
                <div class='inner'>
                    <h1>{props.title}</h1>

                    <nav>
                        <Course />
                        <li>
                            <ResetAllButtonComponent />
                        </li>
                    </nav>

                    <AboutComponent />
                </div>
            </div>
        </aside>
    );
};

export default Menu;
