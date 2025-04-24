/**
 * NB By this stage, courseStore()!.loadCourse(params.courseIdx) has already been called.
 * 
 */
import './CourseEditor.css';
import { createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import { useConfirm } from '../../contexts/ConfirmProvider';
import { ILesson } from "../Lessons/Lesson";
import EditableText from "../CardEditor/Editor/EditableText";
import Card from "../Lessons/Card";
import AddCardButton from './AddCardButton';
import AddLessonButton from './AddLessonButton';
import CourseEditorCardHolder from './CourseEditorCardHolder';

export default function CourseEditor() {
    const [courseStore] = createResource<ICourseStore, true>(useCourseStore);
    const { showConfirm } = useConfirm();
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const [courseTitle, setCourseTitle] = createSignal("");
    const courseIdx = () => Number(params.courseIdx) ?? -1;

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    createEffect(() => {
        if (courseStore.loading) return;
        if (courseStore()?.getCourseIdx !== courseIdx) {
            courseStore()?.setCourseIdx(courseIdx());
        }
        courseStore()!.setLessons(courseIdx(), courseStore()!.store.lessons);
        setCourseTitle(courseStore()!.store.courseMetadata?.courseTitle ?? "");
    });

    const updateLesson = (lessonIdx: number, updateFn: (lesson: ILesson) => ILesson) => {
        const updated = [...courseStore()!.lessons()];
        updated[lessonIdx] = updateFn(updated[lessonIdx]);
        courseStore()!.setLessons(courseIdx(), updated);
    };


    return (
        <Show when={courseStore()} fallback={<p>{t('loading')}...</p>}>
            <article class="course-editor" role="dialog" aria-modal="true">
                <header>
                    <h2>
                        {t('course')}:&nbsp;
                        <q>
                            <EditableText value={courseTitle()} onChange={setCourseTitle} />
                        </q>
                    </h2>
                    <h3>All Lessons and Cards</h3>

                    {courseStore()!.lessons().length > 1 &&
                        <nav class="lesson-pager">
                            {courseStore()!.lessons().map((lesson, idx) => (
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

                <div class="lessons">
                    {courseStore()!.lessons().map((lesson, lessonIdx) => (
                        <section id={`lesson-${lessonIdx}`}>
                            <header>
                                <h3>
                                    {lessonIdx + 1}: &nbsp;
                                    <EditableText
                                        value={lesson.title}
                                        onChange={(newVal) =>
                                            updateLesson(lessonIdx, lesson => ({ ...lesson, title: newVal }))
                                        }
                                    />
                                </h3>

                                <h4>
                                    <EditableText
                                        value={lesson.description ?? ""}
                                        onChange={(newVal) =>
                                            updateLesson(lessonIdx, lesson => ({ ...lesson, description: newVal }))
                                        }
                                    />
                                </h4>
                            </header>

                            <div class="cards">
                                {lesson.cards.map((card, cardIdx) => (
                                    <div class="card-holder">
                                        <CourseEditorCardHolder
                                            lesson={lesson} lessonIdx={lessonIdx}
                                            card={card} cardIdx={cardIdx}
                                        />
                                    </div>
                                ))}

                                <AddCardButton lessonIdx={lessonIdx} />
                            </div>
                        </section>
                    ))}

                    <section>
                        <div>
                            <AddLessonButton />
                        </div>
                    </section>
                </div>
            </article>
        </Show>
    );
}
