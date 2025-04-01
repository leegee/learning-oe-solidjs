import { createSignal } from "solid-js";
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

            <nav class={`hamburger-menu ${isOpen() ? "open" : ""}`}>
                <ul>
                    <li><a href="#" onClick={closeMenu}>Home</a></li>
                    <li><a href="#" onClick={closeMenu}>About</a></li>
                    <li><a href="#" onClick={closeMenu}>Lessons</a></li>
                    <li><a href="#" onClick={closeMenu}>Stats</a></li>
                </ul>
            </nav>
        </aside>
    );
};

export default Menu;
