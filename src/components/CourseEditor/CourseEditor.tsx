import './CourseEditor.css';
import { createEffect, onCleanup, Show } from "solid-js";
import { getCourseStore } from "../../global-state/course";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import EditableText from "../CardEditor/Editor/EditableText";
import CourseEditorLessonList from './CourseEditorLessonList';
import DeleteCourseButton from './DeleteCourseButton';
import { useConfigContext } from '../../contexts/ConfigProvider';

export default function CourseEditor() {
    const courseStore = getCourseStore();
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const { config } = useConfigContext();

    createEffect(() => {
        console.log('editor course idx:', params.courseIdx);
    });

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    return (
        <article class="course-editor" role="dialog" aria-modal="true">
            <header>
                <h2>
                    {t('course')}:&nbsp;
                    <q>
                        <EditableText
                            value={courseStore.getTitle() ?? ""}
                            onChange={(newTitle) => courseStore.setTitle(newTitle)}
                        />
                    </q>
                    <Show when={Number(params.courseIdx) < config.courses.length}>
                        <nav class="coourse-action-buttons">
                            <DeleteCourseButton courseIdx={Number(params.courseIdx)} />
                        </nav>
                    </Show>
                </h2>
                <h3>
                    <q>
                        <EditableText
                            value={courseStore.getDescription() ?? "Description"}
                            onChange={(newDesc) => courseStore.setDescription(newDesc)}
                        />
                    </q>
                </h3>

                {courseStore.getLessons()?.length > 1 && (
                    <nav class="lesson-pager">
                        {courseStore.getLessons().map((lesson, idx) => (
                            <button
                                class="pager-link"
                                onClick={() => navigate(`#lesson-${idx}`)}
                                aria-label={`Go to lesson ${idx + 1}: ${lesson.title}`}
                            >
                                {idx + 1}: {lesson.title}
                            </button>
                        ))}
                    </nav>
                )}
            </header>

            <CourseEditorLessonList />
        </article>
    );
}
