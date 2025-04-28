import './MenuScreen.css';
import { createSignal, createEffect, createResource, Show } from "solid-js";
import packageJson from '../../../package.json';
import { courseTitlesInIndexOrder, type ICourseStore, useCourseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/ConfigProvider";
import ResetCourseButtonComponent from "../../components/ResetCourseButton";
import TitleComponent from "../../components/Menu/Title";
import { useNavigate } from "@solidjs/router";
import CourseEditorButton from "../../components/CourseEditor/CourseEditorButton";
import { useI18n } from "../../contexts/I18nProvider";
import CourseDownloadButton from '../../components/CourseEditor/CourseDownloadButton';
import NewCourseButton from '../../components/CourseEditor/NewCourseButton';
import CourseLoadButton from '../../components/CourseEditor/CourseUploadButton';

const MenuScreen = () => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    const { t } = useI18n();
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);

    const setLocalSelectedCourse = (courseIndex: number) => {
        setLocalCourseIndex(courseIndex);
        navigate('/course/' + courseIndex);
    };

    createEffect(() => {
        if (!courseStore.loading) {
            if (isNaN(localCourseIndex())) {
                console.debug('local course index is NaN?');
                return;
            }
        }
    });

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <aside aria-roledescription="Toggle menu" class="hamburger-menu">
                <section class='card'>
                    <TitleComponent title={config.menuTitle || config.appTitle} />

                    {<h3>{t('choose_a_course')}</h3>}

                    <nav class="course-menu">


                        {/** TODO This needs to come from cached data */}

                        {/* {config.courses.map((course, courseIdx) => ( */}
                        {courseTitlesInIndexOrder(config).map((title, courseIdx) => (
                            <li tabIndex={courseIdx + 1} class={localCourseIndex() === courseIdx ? 'selected' : ''}>
                                <a onClick={() => setLocalSelectedCourse(courseIdx)}>
                                    {title}
                                    {/* {courseStore()?.getTitle()} */}
                                </a>
                                <span class='course-action-buttons'>
                                    <ResetCourseButtonComponent courseIdx={courseIdx} />
                                    <CourseDownloadButton />
                                    <CourseEditorButton courseIdx={courseIdx} />
                                </span>
                            </li>
                        ))}

                        <li>
                            <a onClick={() => { navigate('/editor/' + config.courses.length) }}>
                                Custom Course
                            </a>
                            <span class='course-action-buttons'>
                                <CourseLoadButton courseIdx={courseTitlesInIndexOrder(config).length} />
                                <NewCourseButton />
                            </span>
                        </li>

                    </nav>

                    <footer>
                        <small>Version {packageJson.version}</small>
                    </footer>
                </section>
            </aside>
        </Show>
    );
};

export default MenuScreen;
