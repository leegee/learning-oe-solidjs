import './DashboardCourseOverview.css';
import { createEffect, createSignal } from "solid-js";
import { courseStore } from "../../global-state/course";
import EditableText from "./details/Editor/EditableText";
import Card from "../lessons/Card";
import { Lesson } from "../lessons/Lesson";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";

const EDITING_LESSON_STORAGE_KEY = "oe-lesson-editing";

export const persist = (data: any) => {
    localStorage.setItem(EDITING_LESSON_STORAGE_KEY, JSON.stringify(data));
};

export default function DashboardCourseOverview() {
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const [lessons, setLessons] = createSignal<Lesson[]>([]);
    const [courseTitle, setCourseTitle] = createSignal("");
    const [courseIdx, setCourseIdx] = createSignal<number>(Number(params.courseIdx));

    createEffect(() => {
        if (courseIdx()) {
            courseStore.setSelectedCourse(courseIdx());
        }

        const { lessons, courseMetadata } = courseStore.store;

        if (courseMetadata) {
            setLessons(lessons);
            setCourseTitle(courseMetadata.courseTitle);
        }
    });

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
        <article class="course-overview" role="dialog" aria-modal="true">
            <header>
                <h2>
                    {t('course')}:
                    <q>
                        <EditableText value={courseTitle()} onChange={(newVal) => setCourseTitle(newVal)} />
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
                                {idx + 1} {lesson.title}
                            </button>
                        ))}
                    </nav>
                }
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
                                            tabindex={-1}
                                            card={card}
                                            lesson={lesson}
                                            ondblclick={() => navigate(`/editor/${courseIdx()}/${idx}/${cardIdx}`)}
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
    );
}
