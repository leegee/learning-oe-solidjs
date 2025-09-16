import './Header.css';
import { Match, Show, Switch } from 'solid-js';
import { A, useParams } from "@solidjs/router";

import { getCourseStore } from '../../global-state/course';
import { useConfigContext } from "../../contexts/ConfigProvider";
import MenuToggleButton from "../Menu/MenuToggleButton";
import { exitFullscreen } from '../../lib/fullscreen';

const Header = () => {
    const params = useParams();
    const { config } = useConfigContext();
    const courseStore = getCourseStore();

    const hasCourse = !!params.courseIdx && config.allowCustomisation;

    return (
        <Show when={courseStore} fallback={<p>Loading...</p>}>
            <header class='header-component'>
                <div class="header-text">
                    <h1 lang={config.targetLanguage}>{config.appTitle}</h1>
                    <Switch>
                        <Match when={config.homeInsteadOfMenu}>
                            <button class="large-icon-button" aria-label="Home">
                                <A href='/home' onclick={() => exitFullscreen()}>
                                    <span class={`utf8-icon-home`} />
                                </A>
                            </button>
                        </Match>
                        <Match when={hasCourse}>
                            <MenuToggleButton />
                        </Match>
                    </Switch>
                </div>
            </header>
        </Show>
    );
};

export default Header;
