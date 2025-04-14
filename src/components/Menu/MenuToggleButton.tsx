import './MenuToggleButton.css';
import { useLocation, useNavigate } from "@solidjs/router";
import { createSignal } from "solid-js";
import { useAppPath } from '../../lib/use-app-path';

const MenuToggle = () => {
    const routerLocation = useLocation();
    const navigate = useNavigate();
    const [lastNonMenuPath, setLastNonMenuPath] = createSignal("/");

    const baseRoute = useAppPath();

    const getPathWithoutBase = () => routerLocation.pathname.replace(baseRoute, '') || '/';

    const isMenuOpen = () => /\/menu(\/|$)/.test(routerLocation.pathname);

    const toggleMenu = () => {
        if (isMenuOpen()) {
            // Use path without base
            console.log('lastNonMenuPath()', lastNonMenuPath())
            navigate(lastNonMenuPath());
        } else {
            setLastNonMenuPath(getPathWithoutBase());
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
