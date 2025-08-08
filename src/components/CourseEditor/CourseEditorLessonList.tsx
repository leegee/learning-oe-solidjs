import './CourseEditor.css';
import { createEffect, For, onCleanup, Show } from "solid-js";
import { getCourseStore } from "../../global-state/course";
import { ILesson } from "../Lessons/Lesson";
import EditableText from "../CardEditor/Editor/EditableText";
import AddCardButton from './AddCardButton';
import AddLessonButton from './AddLessonButton';
import CourseEditorCardHolder from './CourseEditorCardHolder';

export default function CourseEditorLessonList() {
    const courseStore = getCourseStore();

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    const updateLesson = (lessonIdx: number, updateFn: (lesson: ILesson) => ILesson) => {
        const updatedLessons = [...courseStore.getLessons()];
        updatedLessons[lessonIdx] = updateFn(updatedLessons[lessonIdx]);
        courseStore.setLessons(updatedLessons);
    };

    return (
        <>
            {courseStore.getLessons().map((lesson, lessonIdx) => (
                <section id={`lesson-${lessonIdx}`} class='lesson'>
                    <header>
                        <h3>
                            <span>
                                {lessonIdx + 1}: &nbsp;
                                <EditableText
                                    value={lesson.title}
                                    onChange={(newVal) =>
                                        updateLesson(lessonIdx, lesson => ({ ...lesson, title: newVal }))
                                    }
                                />
                            </span>
                            <AddLessonButton lessonIdx={lessonIdx} />
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
                        <For each={lesson.cards}>
                            {(card, cardIdx) => (
                                <div class="card-holder">
                                    <CourseEditorCardHolder
                                        lesson={lesson}
                                        lessonIdx={lessonIdx}
                                        card={card}
                                        cardIdx={cardIdx()}
                                    />
                                </div>
                            )}
                        </For>

                        <AddCardButton lessonIdx={lessonIdx} />
                    </div>

                </section>
            ))}

            <Show when={courseStore.getLessons().length === 0}>
                <article class='card no-set-height no-lessons'>
                    <button
                        class="large-icon-button icon-plus-thin"
                        title="Add a new lesson to this course"
                        onClick={() => courseStore.addLesson(0)}
                    />
                    <p>Click above to create your first lesson</p>
                    <p>Click titles and descriptions to edit them</p>
                </article>
            </Show>
        </>
    );
}
