import './MenuScreen.css';
import { createSignal, createEffect, Show } from "solid-js";
import packageJson from '../../../package.json';
import { courseTitlesInIndexOrder, getCourseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/ConfigProvider";
import ResetCourseButtonComponent from "../../components/ResetCourseButton";
import TitleComponent from "../../components/Menu/Title";
import { useNavigate } from "@solidjs/router";
import CourseEditorButton from "../../components/CourseEditor/CourseEditorButton";
import CourseDownloadButton from '../../components/CourseEditor/CourseDownloadButton';
import NewCourseButton from '../../components/CourseEditor/NewCourseButton';
import CourseLoadButton from '../../components/CourseEditor/CourseUploadButton';

const MenuScreen = () => {
    const courseStore = getCourseStore();
    const [editing, setEditing] = createSignal(false);
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(courseIndex);
        navigate('/course/' + courseIndex);
    };

    createEffect(() => {
        if (!courseStore) {
            console.warn("Course store not available");
            return;
        }
        if (isNaN(localCourseIndex())) {
            console.debug('local course index is NaN?');
        }
    });

    return (
        <Show when={courseStore} fallback={<p>Loading...</p>}>
            <aside aria-roledescription="Toggle menu" class="hamburger-menu">
                <section class='card'>
                    <TitleComponent title={config.menuTitle || config.appTitle} />

                    <menu class={"course-menu " + (editing() ? 'editing' : '')}>

                        {courseTitlesInIndexOrder(config).map((title, courseIdx) => (
                            <li
                                // tabIndex={courseIdx + 1} 
                                class={localCourseIndex() === courseIdx ? 'selected' : ''}>
                                <a onClick={() => setLocalSelectedCourse(courseIdx)}>
                                    {title}
                                </a>
                                <Show when={editing()}>
                                    <span class='course-action-buttons'>
                                        <ResetCourseButtonComponent courseIdx={courseIdx} />
                                        <CourseDownloadButton courseIdx={courseIdx} />
                                        <CourseEditorButton courseIdx={courseIdx} />
                                    </span>
                                </Show>
                            </li>
                        ))}

                        <Show when={config.allowCustomisation}>
                            <li>
                                <a onClick={() => { navigate('/course/' + config.courses.length) }}>
                                    Custom Course
                                </a>
                                <Show when={editing()}>
                                    <span class='course-action-buttons'>
                                        <NewCourseButton />
                                        <CourseLoadButton />
                                        <CourseDownloadButton courseIdx={courseTitlesInIndexOrder(config).length} />
                                        <CourseEditorButton courseIdx={courseTitlesInIndexOrder(config).length} />
                                    </span>
                                </Show>
                            </li>
                        </Show>
                    </menu>

                    <Show when={config.allowCustomisation}>
                        <footer>
                            <small>
                                <button onClick={() => setEditing(!editing())}>Edit Courses </button>
                            </small>
                        </footer>
                    </Show>

                </section>
                <footer>
                    <small>Version {packageJson.version}</small>
                </footer>
            </aside>
        </Show>
    );
};

export default MenuScreen;
