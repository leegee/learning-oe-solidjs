import { createEffect, createSignal, on, Show } from "solid-js";
import Card from "./Card";
import { type Lesson } from "./Lesson";
import EditCardModal from "./EditCardModal";
import { type IAnyCard } from "./cards";
import { type CourseMetadata } from "../global-state/course";
import EditableText from "./Editor/EditableText";
import './CourseOverview.css';

export interface ICourseOverviewProps {
    courseMetadata: CourseMetadata;
    lessons: Lesson[];
}

export default function CourseOverview(props: ICourseOverviewProps) {
    const [isOpen, setOpen] = createSignal(false);
    const [lessons, setLessons] = createSignal<Lesson[]>([]);
    const [courseMetadata, setCourseMetadata] = createSignal<CourseMetadata>({} as CourseMetadata);
    const [courseTitle, setCourseTitle] = createSignal<string>(props.courseMetadata.courseTitle);
    const [editingCardInfo, setEditingCardInfo] = createSignal<{ lessonIdx: number; cardIdx: number } | null>(null);
    const EDITING_LESSON_STORAGE_KEY = 'oe-lesson-editing';

    const toggle = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen(!isOpen());
    };

    createEffect(
        on(
            () => [props.lessons, props.courseMetadata] as [Lesson[], CourseMetadata],
            ([lessons, metadata]: [Lesson[], CourseMetadata]) => {
                setCourseMetadata(metadata);
                setCourseTitle(metadata.courseTitle);
                setLessons(lessons);
                console.log('---set lessons', lessons);
            }
        )
    );

    const persist = (data: Lesson[]) => {
        console.log('persist', data);
        localStorage.setItem(EDITING_LESSON_STORAGE_KEY, JSON.stringify(data));
    };

    const cancelEditing = (e: Event) => {
        e.stopPropagation();
        setEditingCardInfo(null);
    }

    const moveCard = (lessonIdx: number, cardIdx: number, direction: 1 | -1) => {
        const currentLessons = [...lessons()];
        const sourceLesson = currentLessons[lessonIdx];
        const cardToMove = sourceLesson.cards[cardIdx];

        const targetCardIdx = cardIdx + direction;

        if (targetCardIdx >= 0 && targetCardIdx < sourceLesson.cards.length) {
            // Intra-lesson move
            const updatedCards = [...sourceLesson.cards];
            [updatedCards[cardIdx], updatedCards[targetCardIdx]] = [updatedCards[targetCardIdx], updatedCards[cardIdx]];
            currentLessons[lessonIdx] = { ...sourceLesson, cards: updatedCards };
        } else {
            // Inter-lesson move
            const targetLessonIdx = lessonIdx + direction;
            if (targetLessonIdx < 0 || targetLessonIdx >= currentLessons.length) return;

            const targetLesson = currentLessons[targetLessonIdx];
            const sourceCards = [...sourceLesson.cards];
            const targetCards = [...targetLesson.cards];

            sourceCards.splice(cardIdx, 1);

            if (direction === 1) {
                targetCards.unshift(cardToMove); // insert at beginning
            } else {
                targetCards.push(cardToMove); // insert at end
            }

            currentLessons[lessonIdx] = { ...sourceLesson, cards: sourceCards };
            currentLessons[targetLessonIdx] = { ...targetLesson, cards: targetCards };
        }

        setLessons(currentLessons);
        persist(currentLessons);
    };

    const moveCardBetweenLessons = (lessonIdx: number, cardIdx: number, direction: 1 | -1) => {
        const data = [...lessons()];
        const sourceLesson = data[lessonIdx];
        const targetLessonIdx = lessonIdx + direction;

        if (targetLessonIdx < 0 || targetLessonIdx >= data.length || !sourceLesson.cards[cardIdx]) return;

        const card = sourceLesson.cards[cardIdx];
        const newSourceCards = [...sourceLesson.cards];
        newSourceCards.splice(cardIdx, 1);

        const targetLesson = data[targetLessonIdx];
        const newTargetCards = [...targetLesson.cards];

        if (direction === 1) {
            newTargetCards.unshift(card);
        } else {
            newTargetCards.push(card);
        }

        data[lessonIdx] = { ...sourceLesson, cards: newSourceCards };
        data[targetLessonIdx] = { ...targetLesson, cards: newTargetCards };

        setLessons(data);
        persist(data);
    };

    // createEffect(() => {
    // if (isOpen()) {
    // const handleKeys = (e: KeyboardEvent) => {
    // };
    // 
    // window.addEventListener('keydown', handleKeys);
    // onCleanup(() => window.removeEventListener('keydown', handleKeys));
    // }
    // });

    return (
        <>
            <button class="course-overview-button" onClick={toggle}> 🖊️ </button>

            <Show when={isOpen()}>
                <aside class="modal-bg">
                    <article class="course-overview" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <header>
                            <div>
                                <h2>Course Overview:&nbsp;
                                    <q>
                                        <EditableText
                                            value={courseTitle()}
                                            onChange={(newVal) => setCourseTitle(newVal)}
                                        />
                                    </q>
                                </h2>
                                <h3>All Lessons and Cards</h3>
                                <nav class="lesson-pager">
                                    {lessons().map((lesson, idx) => (
                                        <a role='button' class='pager-link button' href={`#lesson-${idx}`}>
                                            {idx + 1} {lesson.title}
                                        </a>
                                    ))}
                                </nav>

                            </div>
                            <button onClick={toggle}>✕</button>
                        </header>

                        <div class="lessons">
                            {lessons().map((lesson, idx) => (
                                <section id={`lesson-${idx}`}>
                                    {/* <a href={`#lesson-${idx}`} /> */}

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
                                                value={lesson.description || ''}
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
                                            <div class="card-holder" >
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
                                                        title="Move to the left in this lessons"
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
                                                        title="Move to the right in this lessons"
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
                </aside>
            </Show>

            <Show when={editingCardInfo()}>
                <EditCardModal
                    card={lessons()[
                        editingCardInfo()!.lessonIdx
                    ].cards[
                        editingCardInfo()!.cardIdx
                    ]}
                    onSave={(updatedCard: IAnyCard) => {
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
