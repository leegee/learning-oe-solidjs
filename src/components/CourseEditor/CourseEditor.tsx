import './CourseEditor.css';
import { createEffect, createResource, createSignal, onCleanup } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import EditableText from "../CardEditor/Editor/EditableText";
import Card from "../Lessons/Card";
import { Lesson } from "../Lessons/Lesson";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import { useConfirm } from '../../contexts/Confirm';
import AddCardButton from './AddCardButton';
import { useLessonStore } from '../../global-state/lessons';
import { createDefaultCard } from '../Cards';

const EDITING_LESSON_STORAGE_KEY = "oe-lesson-editing";

export const persist = (data: any) => {
    localStorage.setItem(EDITING_LESSON_STORAGE_KEY, JSON.stringify(data));
};

export default function CourseEditor() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const [lessonStore] = createResource(useLessonStore);

    const { showConfirm } = useConfirm();
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const [lessons, setLessons] = createSignal<Lesson[]>([]);
    const [courseTitle, setCourseTitle] = createSignal("");

    createEffect(() => {
        document.body.classList.add("editing-card");
        onCleanup(() => {
            document.body.classList.remove("editing-card");
        });
    });

    createEffect(() => {
        const cStore = courseStore();
        const lStore = lessonStore();
        if (!cStore || !lStore) return;

        cStore.setCourseIdx(Number(params.courseIdx) || -1);
        setLessons(cStore.store.lessons);
        setCourseTitle(cStore.store.courseMetadata?.courseTitle ?? "");
    });

    const deleteCard = (lessonIdx: number, cardIdx: number) => {
        showConfirm(t('confirm_delete_card'), () => {
            const updated = lessons().map((lesson, i) =>
                i === lessonIdx
                    ? { ...lesson, cards: lesson.cards.filter((_, j) => j !== cardIdx) }
                    : lesson
            );
            setLessons(updated);
            persist(updated);
        });
    };

    const updateLesson = (lessonIdx: number, updateFn: (lesson: Lesson) => Lesson) => {
        const updated = [...lessons()];
        updated[lessonIdx] = updateFn(updated[lessonIdx]);
        setLessons(updated);
        persist(updated);
    };

    const moveCard = (lessonIdx: number, cardIdx: number, direction: number) => {
        const updatedLessons = [...lessons()];
        const lesson = updatedLessons[lessonIdx];
        const card = lesson.cards[cardIdx];
        const newCardIdx = cardIdx + direction;

        if (newCardIdx >= 0 && newCardIdx < lesson.cards.length) {
            lesson.cards.splice(cardIdx, 1);
            lesson.cards.splice(newCardIdx, 0, card);
            setLessons(updatedLessons);
            persist(updatedLessons);
        }
    };

    const moveCardBetweenLessons = (lessonIdx: number, cardIdx: number, direction: number) => {
        const updatedLessons = [...lessons()];
        const lesson = updatedLessons[lessonIdx];
        const card = lesson.cards[cardIdx];
        const newLessonIdx = lessonIdx + direction;

        if (newLessonIdx >= 0 && newLessonIdx < updatedLessons.length) {
            lesson.cards.splice(cardIdx, 1);
            updatedLessons[newLessonIdx].cards.push(card);
            setLessons(updatedLessons);
            persist(updatedLessons);
        }
    };

    return (
        <article class="course-editor" role="dialog" aria-modal="true">
            <header>
                <h2>
                    {t('course')}:&nbsp;
                    <q>
                        <EditableText value={courseTitle()} onChange={setCourseTitle} />
                    </q>
                </h2>
                <h3>All Lessons and Cards</h3>

                {lessons().length > 1 &&
                    <nav class="lesson-pager">
                        {lessons().map((lesson, idx) => (
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
                {lessons().map((lesson, lessonIdx) => (
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
                                    <div class="vertical-controls top-controls">
                                        <button
                                            title="Move up to the previous lesson"
                                            disabled={lessonIdx === 0}
                                            onClick={() => moveCardBetweenLessons(lessonIdx, cardIdx, -1)}
                                        >
                                            ↑
                                        </button>
                                    </div>

                                    <div class="horizontal-controls">
                                        <button
                                            title="Swap with the card on the left"
                                            disabled={cardIdx === 0}
                                            onClick={() => moveCard(lessonIdx, cardIdx, -1)}
                                        >
                                            ←
                                        </button>

                                        <div class="card-overlay-wrapper">

                                            <Card
                                                tabindex={-1}
                                                card={card}
                                                lesson={lesson}
                                                ondblclick={() =>
                                                    navigate(`/editor/${courseStore()?.getCourseIdx()}/${lessonIdx}/${cardIdx}`)
                                                }
                                            />

                                            <div class="card-overlay">
                                                <button
                                                    title="Delete"
                                                    class="control small-control"
                                                    onClick={() => deleteCard(lessonIdx, cardIdx)}
                                                >
                                                    🗑
                                                </button>

                                                <button
                                                    title="Edit"
                                                    class="control"
                                                    onClick={() =>
                                                        navigate(`/editor/${courseStore()?.getCourseIdx()}/${lessonIdx}/${cardIdx}`)
                                                    }
                                                >
                                                    ✎
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            title="Swap with the card to the right"
                                            disabled={cardIdx === lesson.cards.length - 1}
                                            onClick={() => moveCard(lessonIdx, cardIdx, 1)}
                                        >
                                            →
                                        </button>
                                    </div>

                                    <div class="vertical-controls bottom-controls">
                                        <button
                                            title="Move to the next lesson"
                                            onClick={() => moveCardBetweenLessons(lessonIdx, cardIdx, 1)}
                                            disabled={lessonIdx === lessons().length - 1}
                                        >
                                            ↓
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <AddCardButton
                                onAdd={(klass) => {
                                    const newCard = createDefaultCard(klass);
                                    const updatedLessons = lessons().map(lesson => ({
                                        ...lesson,
                                        cards: [...lesson.cards, newCard]
                                    }));
                                    persist(updatedLessons);
                                    setLessons(updatedLessons);
                                    // const newIdx = updatedLessons[lessonIdx].cards.length - 1;
                                    // navigate(`/editor/${courseStore()?.getCourseIdx()}/${lessonIdx}/${newIdx}`);
                                }}
                            />
                        </div>
                    </section>
                ))}
            </div>
        </article>
    );
}
