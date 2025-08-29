import './Header.css';
import { Show } from 'solid-js';
import { useParams } from "@solidjs/router";

import { getCourseStore } from '../../global-state/course';
import { useConfigContext } from "../../contexts/ConfigProvider";
import MenuTogglebutton from "../Menu/MenuToggleButton";

const Header = () => {
    const params = useParams();
    const { config } = useConfigContext();
    const courseStore = getCourseStore();

    const hasCourse = !!params.courseIdx;

    return (
        <Show when={courseStore} fallback={<p>Loading...</p>}>
            <header class='header-component'>
                <div class="header-text">
                    <h1 lang={config.targetLanguage}>{config.appTitle}</h1>
                    <Show when={hasCourse}>
                        <MenuTogglebutton />
                    </Show>
                </div>
            </header>
        </Show>
    );
};

export default Header;
