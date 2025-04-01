import { createSignal } from "solid-js";
import Course from "../../Course";
import './Menu.css';

const Menu = () => {
    const [isOpen, setIsOpen] = createSignal(false);
    const toggleMenu = () => setIsOpen(prev => !prev);
    const closeMenu = () => setIsOpen(false);

    return (
        <aside aria-roledescription="Toggle menu" class="menu-container">
            <button class="hamburger-button" onClick={toggleMenu}>
                <span class="hamburger-icon">☰</span>
            </button>

            <nav class={`hamburger-menu ${isOpen() ? "open" : ""}`} onClick={closeMenu}>
                <Course />
            </nav>
        </aside>
    );
};

export default Menu;
