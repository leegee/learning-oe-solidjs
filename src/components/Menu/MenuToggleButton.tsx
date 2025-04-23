import './MenuToggleButton.css';
import { useLocation, useNavigate } from "@solidjs/router";
import { createEffect, createSignal } from "solid-js";
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
            // navigate(lastNonMenuPath());
            if (lastNonMenuPath() === getPathWithoutBase()) {
                navigate('/');
            } else {
                window.history.back();
            }
        } else {
            setLastNonMenuPath(getPathWithoutBase());
            navigate("/menu");
        }
    };

    createEffect(() => {
        if (isMenuOpen()) {
            document.body.classList.add("menu-shown");
        } else {
            document.body.classList.remove("menu-shown");
        }
    });

    return (
        <button class="hamburger-button large-icon-button" onClick={toggleMenu} aria-label="Toggle menu">
            <span class={`utf8-icon-${isMenuOpen() ? 'close' : 'menu'}`} />
        </button>
    );
};

export default MenuToggle;
