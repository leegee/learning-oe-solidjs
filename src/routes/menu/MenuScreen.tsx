import './MenuScreen.css';
import { createSignal, createEffect, createResource } from "solid-js";
import packageJson from '../../../package.json';
import { type ICourseStore, useCourseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/ConfigProvider";
import ResetCourseButtonComponent from "../../components/ResetCourseButton";
import TitleComponent from "../../components/Menu/Title";
import { useNavigate } from "@solidjs/router";
import CourseEditorButton from "../../components/CourseEditor/CourseEditorButton";
import { useI18n } from "../../contexts/I18nProvider";


const MenuScreen = () => {
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());

    const { t } = useI18n();
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [localCourseIndex, setLocalCourseIndex] = createSignal<number>(0);

    // Use the store when it's resolved
    createEffect(() => {
        const store = courseStore();
        if (store) {
            setLocalCourseIndex(store.getCourseIdx());
        }
    });

    const setLocalSelectedCourse = (courseIndex: number) => {
        const store = courseStore();
        if (store) {
            store.setCourseIdx(courseIndex);
        }
        setLocalCourseIndex(courseIndex);
        navigate('/course/' + courseIndex);
    };

    createEffect(() => {
        const store = courseStore();
        if (store) {
            store.setCourseIdx(localCourseIndex());
        }
    });

    return (
        <aside aria-roledescription="Toggle menu" class="hamburger-menu">
            <section class='card'>
                <TitleComponent title={config.appTitle} />

                {courseStore() && courseStore()!.getCourseIdx() === -1 && <h3>{t('choose_a_course')}</h3>}

                <nav class="course-menu">
                    {config.lessons.map((course, courseIdx) => (
                        <li tabIndex={courseIdx + 1} class={localCourseIndex() === courseIdx ? 'selected' : ''}>
                            <button onClick={() => setLocalSelectedCourse(courseIdx)}>
                                {course.title}
                            </button>

                            {localCourseIndex() === courseIdx &&
                                courseStore()?.getCourseIdx() === courseIdx &&
                                courseStore()?.store.courseMetadata &&
                                !courseStore()?.store.loading && (
                                    <CourseEditorButton courseIdx={courseIdx} />
                                )}
                        </li>
                    ))}

                    <li tabIndex={config.lessons.length + 1}>
                        <ResetCourseButtonComponent />
                    </li>
                </nav>

                <footer>
                    <small>Version {packageJson.version}</small>
                </footer>
            </section>
        </aside>
    );
};

export default MenuScreen;
