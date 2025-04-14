import { createEffect, createSignal, Show } from "solid-js";
import { courseStore } from "../../global-state/course";
import EditableText from "./details/Editor/EditableText";
import Card from "../Lessons/Card";
import EditCardModal from "./details/EditCardModal";
import { Lesson } from "../Lessons/Lesson";

export default function DashboardCourseOverview() {
    const [editingCardInfo, setEditingCardInfo] = createSignal<{ lessonIdx: number; cardIdx: number } | null>(null);
    const [lessons, setLessons] = createSignal<Lesson[]>([]);
    const [courseTitle, setCourseTitle] = createSignal("");
    const EDITING_LESSON_STORAGE_KEY = "oe-lesson-editing";

    createEffect(() => {
        const { store } = courseStore;
        const { lessons, courseMetadata } = store;

        if (courseMetadata) {
            setLessons(lessons);
            setCourseTitle(courseMetadata.courseTitle);
            console.log("---set lessons", lessons);
        }
    });

    const persist = (data: any) => {
        localStorage.setItem(EDITING_LESSON_STORAGE_KEY, JSON.stringify(data));
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

    const cancelEditing = (e: Event) => {
        e.preventDefault();
        setEditingCardInfo(null);
    };

    return (
        <>
            <article class="course-overview" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <header>
                    <h2>
                        Course Overview:&nbsp;
                        <q>
                            <EditableText value={courseTitle()} onChange={(newVal) => setCourseTitle(newVal)} />
                        </q>
                    </h2>
                    <h3>All Lessons and Cards</h3>
                    <nav class="lesson-pager">
                        {lessons().map((lesson, idx) => (
                            <a role="button" class="pager-link button" href={`#lesson-${idx}`}>
                                {idx + 1} {lesson.title}
                            </a>
                        ))}
                    </nav>
                </header>

                <div class="lessons">
                    {lessons().map((lesson, idx) => (
                        <section id={`lesson-${idx}`}>
                            <header>
                                <h3>
                                    <EditableText
                                        value={lesson.title}
                                        onChange={(newVal) => {
                                            const updatedLessons = [...lessons()];
                                            updatedLessons[idx] = { ...lesson, title: newVal };
                                            setLessons(updatedLessons);
                                            persist(updatedLessons);
                                        }}
                                    />
                                </h3>

                                <h4>
                                    <EditableText
                                        value={lesson.description || ""}
                                        onChange={(newVal) => {
                                            const updatedLessons = [...lessons()];
                                            updatedLessons[idx] = { ...lesson, description: newVal };
                                            setLessons(updatedLessons);
                                            persist(updatedLessons);
                                        }}
                                    />
                                </h4>
                            </header>

                            <div class="cards">
                                {lesson.cards.map((card, cardIdx) => (
                                    <div class="card-holder">
                                        <div class="vertical-controls top-controls">
                                            <button
                                                title="Move up to the previous lessons"
                                                disabled={idx === 0}
                                                onClick={() => moveCardBetweenLessons(idx, cardIdx, -1)}
                                            >
                                                ↑
                                            </button>
                                        </div>

                                        <div class="horizontal-controls">
                                            <button
                                                title="Swap with the card on the left"
                                                disabled={cardIdx === 0}
                                                onClick={() => moveCard(idx, cardIdx, -1)}
                                            >
                                                ←
                                            </button>

                                            <Card
                                                card={card}
                                                lesson={lesson}
                                                ondblclick={() => {
                                                    setEditingCardInfo({ lessonIdx: idx, cardIdx });
                                                }}
                                            />

                                            <button
                                                title="Swap with the card to the right"
                                                disabled={cardIdx === lesson.cards.length - 1}
                                                onClick={() => moveCard(idx, cardIdx, 1)}
                                            >
                                                →
                                            </button>
                                        </div>

                                        <div class="vertical-controls bottom-controls">
                                            <button
                                                title="Move to the next lesson"
                                                onClick={() => moveCardBetweenLessons(idx, cardIdx, 1)}
                                                disabled={idx === lessons().length - 1}
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </article>

            <Show when={editingCardInfo()}>
                <EditCardModal
                    card={lessons()[editingCardInfo()!.lessonIdx].cards[editingCardInfo()!.cardIdx]}
                    onSave={(updatedCard: any) => {
                        const data = [...lessons()];
                        data[editingCardInfo()!.lessonIdx].cards[editingCardInfo()!.cardIdx] = updatedCard;
                        setLessons(data);
                        persist(data);
                        setEditingCardInfo(null);
                    }}
                    onCancel={(e: Event) => cancelEditing(e)}
                />
            </Show>
        </>
    );
}
