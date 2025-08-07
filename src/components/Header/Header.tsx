import './Header.css';
import { Show } from 'solid-js';
import { getCourseStore } from '../../global-state/course';
import MenuTogglebutton from "../Menu/MenuToggleButton";
import { useConfigContext } from "../../contexts/ConfigProvider";

const Header = () => {
    const { config } = useConfigContext();
    const courseStore = getCourseStore();

    return (
        <Show when={courseStore} fallback={<p>Loading...</p>}>
            <header class='header-component'>
                <div class="header-text">
                    <h1 lang={config.targetLanguage}>{config.appTitle}</h1>
                    <MenuTogglebutton />
                </div>
            </header>
        </Show>
    );
};

export default Header;
