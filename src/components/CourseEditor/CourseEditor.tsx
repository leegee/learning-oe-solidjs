/**
 * NB By this stage, courseStore()!.loadCourse(params.courseIdx) has already been called.
 * 
 */
import './CourseEditor.css';
import { createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import EditableText from "../CardEditor/Editor/EditableText";
import CourseEditorLessonList from './CourseEditorLessonList';
import DeleteCourseButton from './DeleteCourseButton';

export default function CourseEditor() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const [courseTitle, setCourseTitle] = createSignal("");

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    createEffect(() => {
        if (courseStore.loading) return;
        setCourseTitle(courseStore()!.store.courseMetadata?.courseTitle ?? "");
    });

    return (
        <Show when={courseStore()} fallback={<p>{t('loading')}...</p>}>
            {(store) => {
                const lessons = store().lessons();
                return (

                    <article class="course-editor" role="dialog" aria-modal="true">
                        <header>
                            <h2>
                                {t('course')}:&nbsp;
                                <q>
                                    <EditableText value={courseTitle()} onChange={setCourseTitle} />
                                </q>
                                <nav class="coourse-action-buttons">
                                    <DeleteCourseButton courseIdx={Number(params.courseIdx)} />
                                </nav>
                            </h2>
                            <h3>All Lessons and Cards</h3>

                            {lessons.length > 1 &&
                                <nav class="lesson-pager">
                                    {lessons.map((lesson, idx) => (
                                        <button
                                            class="pager-link"
                                            onClick={() => navigate(`#lesson-${idx}`)}
                                            aria-label={`Go to lesson ${idx + 1}: ${lesson.title}`}
                                        >
                                            {idx + 1}: {lesson.title}
                                        </button>
                                    ))}
                                </nav>
                            }
                        </header>

                        <CourseEditorLessonList />
                    </article>
                )
            }}
        </Show>
    );
}
