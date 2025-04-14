// components/Menu/MenuToggle.tsx
import { useLocation, useNavigate } from "@solidjs/router";
import './Menu.css';

const MenuToggle = () => {
    const routerLocation = useLocation();
    const navigate = useNavigate();

    const isMenuOpen = () => /\/menu(\/|$)/.test(routerLocation.pathname);

    const toggleMenu = () => {
        if (isMenuOpen()) {
            navigate("/");
        } else {
            navigate("/menu");
        }
    };

    return (
        <button class="hamburger-button" onClick={toggleMenu} aria-label="Toggle menu">
            <span class="hamburger-icon">
                {isMenuOpen() ? "✕" : "☰"}
            </span>
        </button>
    );
};

export default MenuToggle;
