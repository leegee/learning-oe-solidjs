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
            navigate(lastNonMenuPath());
        } else {
            setLastNonMenuPath(getPathWithoutBase());
            navigate("/menu");
        }
    };

    return (
        <button class="hamburger-button large-icon-button" onClick={toggleMenu} aria-label="Toggle menu">
            {isMenuOpen() ? "✕" : "☰"}
        </button>
    );
};

export default MenuToggle;
