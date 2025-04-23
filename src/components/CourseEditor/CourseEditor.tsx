import './CourseEditor.css';
import { onMount, createEffect, createResource, createSignal, onCleanup, Show } from "solid-js";
import { useConfigContext } from '../../contexts/ConfigProvider';
import { courseTitlesInIndexOrder, useCourseStore, type ICourseStore } from "../../global-state/course";
import { useNavigate, useParams } from "@solidjs/router";
import { useI18n } from "../../contexts/I18nProvider";
import { useConfirm } from '../../contexts/ConfirmProvider';
import { createDefaultCard } from '../Cards';
import { Lesson } from "../Lessons/Lesson";
import EditableText from "../CardEditor/Editor/EditableText";
import Card from "../Lessons/Card";
import AddCardButton from './AddCardButton';

export default function CourseEditor() {
    const { config } = useConfigContext();
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    const { showConfirm } = useConfirm();
    const { t } = useI18n();
    const navigate = useNavigate();
    const params = useParams();
    const [courseTitle, setCourseTitle] = createSignal("");
    const courseIdx = () => Number(params.courseIdx) ?? -1;


    onMount(() => {
        if (params.courseIdx === 'init') {
            if (!courseStore.loading) {
                const courseIdx = courseTitlesInIndexOrder(config).length;
                console.debug('init');
                courseStore()!.initCourse(courseIdx);
                navigate('/editor/' + courseIdx);
            } else {
                console.error('courseStore still loading');
            }
        }
    });

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

    const deleteCard = (lessonIdx: number, cardIdx: number) => {
        if (courseStore.loading) return;
        showConfirm(t('confirm_delete_card'), () => {
            const updated = (courseStore()!.lessons() as Lesson[]).map((lesson, i) =>
                i === lessonIdx
                    ? { ...lesson, cards: lesson.cards.filter((_, j) => j !== cardIdx) }
                    : lesson
            );
            courseStore()!.setLessons(courseIdx(), updated);
        });
    };

    const updateLesson = (lessonIdx: number, updateFn: (lesson: Lesson) => Lesson) => {
        const updated = [...courseStore()!.lessons()];
        updated[lessonIdx] = updateFn(updated[lessonIdx]);
        courseStore()!.setLessons(courseIdx(), updated);
    };

    const cloneLesson = (lesson: Lesson) => ({
        ...lesson,
        cards: [...lesson.cards],
    });

    const moveCard = (lessonIdx: number, cardIdx: number, direction: number) => {
        const originalLessons = courseStore()!.lessons();
        const updatedLessons = [...originalLessons];

        const lesson = cloneLesson(updatedLessons[lessonIdx]);
        const cards = [...lesson.cards];
        const newCardIdx = cardIdx + direction;

        if (newCardIdx < 0 || newCardIdx >= cards.length) return;

        const [movedCard] = cards.splice(cardIdx, 1);
        cards.splice(newCardIdx, 0, movedCard);

        lesson.cards = cards;
        updatedLessons[lessonIdx] = lesson;
        courseStore()!.setLessons(courseIdx(), updatedLessons);
    };

    const moveCardBetweenLessons = (lessonIdx: number, cardIdx: number, direction: number) => {
        const originalLessons = courseStore()!.lessons();
        const newLessonIdx = lessonIdx + direction;

        if (
            newLessonIdx < 0 ||
            newLessonIdx >= originalLessons.length ||
            cardIdx < 0 ||
            cardIdx >= originalLessons[lessonIdx].cards.length
        ) return;

        const updatedLessons = [...originalLessons];
        const fromLesson = cloneLesson(updatedLessons[lessonIdx]);
        const toLesson = cloneLesson(updatedLessons[newLessonIdx]);

        const fromCards = [...fromLesson.cards];
        const toCards = [...toLesson.cards];

        const [movedCard] = fromCards.splice(cardIdx, 1);
        toCards.push(movedCard);

        fromLesson.cards = fromCards;
        toLesson.cards = toCards;

        updatedLessons[lessonIdx] = fromLesson;
        updatedLessons[newLessonIdx] = toLesson;

        courseStore()!.setLessons(courseIdx(), updatedLessons);
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
                                                        navigate(`/editor/${courseIdx()}/${lessonIdx}/${cardIdx}`)
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
                                                            navigate(`/editor/${courseIdx()}/${lessonIdx}/${cardIdx}`)
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
                                                disabled={lessonIdx === courseStore()!.lessons().length - 1}
                                            >
                                                ↓
                                            </button>
                                        </div>
                                    </div>
                                ))}

                                <AddCardButton
                                    onAdd={(klass) => {
                                        const newCard = createDefaultCard(klass);
                                        const updatedLessons = courseStore()!.lessons().map((lesson, i) =>
                                            i === lessonIdx
                                                ? { ...lesson, cards: [...lesson.cards, newCard] }
                                                : lesson
                                        );

                                        courseStore()!.setLessons(courseIdx(), updatedLessons);

                                        const newCardIdx = updatedLessons[lessonIdx].cards.length - 1;
                                        navigate(`/editor/${courseIdx()}/${lessonIdx}/${newCardIdx}`);
                                    }}
                                />
                            </div>
                        </section>
                    ))}
                </div>
            </article>
        </Show>
    );
}
