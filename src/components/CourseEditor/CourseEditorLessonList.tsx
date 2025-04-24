/**
 * NB By this stage, courseStore()!.loadCourse(params.courseIdx) has already been called.
 * 
 */
import './CourseEditor.css';
import { createEffect, createResource, onCleanup, Show } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import { ILesson } from "../Lessons/Lesson";
import EditableText from "../CardEditor/Editor/EditableText";
import AddCardButton from './AddCardButton';
import AddLessonButton from './AddLessonButton';
import CourseEditorCardHolder from './CourseEditorCardHolder';

export default function CourseEditorLessonList() {
    const [courseStore] = createResource<ICourseStore, true>(useCourseStore);
    const { t } = useI18n();
    const params = useParams();
    const courseIdx = () => Number(params.courseIdx) ?? -1;

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    const updateLesson = (lessonIdx: number, updateFn: (lesson: ILesson) => ILesson) => {
        const updated = [...courseStore()!.lessons()];
        updated[lessonIdx] = updateFn(updated[lessonIdx]);
        courseStore()!.setLessons(courseIdx(), updated);
    };

    return (
        <Show when={courseStore()} fallback={<p>{t('loading')}...</p>}>
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
        </Show>
    );
}
