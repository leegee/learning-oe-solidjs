import { createSignal, onMount, For, Show } from "solid-js";
import Card from "./Card";
import { type Lesson } from "./Lesson";
import './CourseOverview.css';
import EditCardModal from "./EditCardModal";

export default function CourseOverview(props: { lessons: Lesson[] }) {
    const [open, setOpen] = createSignal(false);
    const [lessons, setLessons] = createSignal<Lesson[]>(props.lessons);
    const [editingCardInfo, setEditingCardInfo] = createSignal<{
        lessonIdx: number;
        cardIdx: number;
    } | null>(null);
    const STORAGE_KEY = 'oe-lesson-order';

    const toggle = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen(!open());
    };

    onMount(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setLessons(JSON.parse(saved));
                console.log('Loaded from storage');
                return;
            } catch (err) {
                console.warn("Failed to parse saved lessons:", err);
            }
        }
        console.log('Set to storage', props.lessons);
        setLessons(props.lessons);
    });

    const persist = (data: Lesson[]) => {
        console.log('persist', data);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    };

    const moveCard = (
        lessonIdx: number,
        cardIdx: number,
        direction: 1 | -1
    ) => {
        const currentLessons = [...lessons()];
        const sourceLesson = currentLessons[lessonIdx];
        const cardToMove = sourceLesson.cards[cardIdx];

        const targetCardIdx = cardIdx + direction;

        if (targetCardIdx >= 0 && targetCardIdx < sourceLesson.cards.length) {
            // Intra-lesson move
            const updatedCards = [...sourceLesson.cards];
            [updatedCards[cardIdx], updatedCards[targetCardIdx]] = [updatedCards[targetCardIdx], updatedCards[cardIdx]];
            currentLessons[lessonIdx] = {
                ...sourceLesson,
                cards: updatedCards
            };
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

            currentLessons[lessonIdx] = {
                ...sourceLesson,
                cards: sourceCards
            };
            currentLessons[targetLessonIdx] = {
                ...targetLesson,
                cards: targetCards
            };
        }

        setLessons(currentLessons);
        persist(currentLessons);
    };

    const moveCardBetweenLessons = (
        lessonIdx: number,
        cardIdx: number,
        direction: 1 | -1
    ) => {
        const data = [...lessons()];
        const sourceLesson = data[lessonIdx];
        const targetLessonIdx = lessonIdx + direction;

        if (
            targetLessonIdx < 0 ||
            targetLessonIdx >= data.length ||
            !sourceLesson.cards[cardIdx]
        ) return;

        const card = sourceLesson.cards[cardIdx];
        const newSourceCards = [...sourceLesson.cards];
        newSourceCards.splice(cardIdx, 1);

        const targetLesson = data[targetLessonIdx];
        const newTargetCards = [...targetLesson.cards];

        // Insert the card to start or end depending on direction
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

    return (
        <>
            <button class="course-overview-button" onClick={toggle}>
                <small>Show All Cards For This Course</small>
            </button>

            <Show when={open()}>
                <aside class="modal-bg">
                    <article
                        class="course-overview"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                    >
                        <header>
                            <div>
                                <h2>Course Overview</h2>
                                <h3>All Lessons and Cards</h3>
                            </div>
                            <button onClick={toggle}>✕</button>
                        </header>

                        <div class="lessons">
                            <For each={lessons()}>
                                {(lesson, lessonIdx) => (
                                    <section>
                                        <header>
                                            <h4>{lesson.title}</h4>
                                            <h5>{lesson.description}</h5>
                                        </header>
                                        <div class="cards">
                                            <For each={lesson.cards}>
                                                {(card, cardIdx) => (
                                                    <div class="card-holder">

                                                        <div class="vertical-controls top-controls">
                                                            <button disabled={lessonIdx() === 0}
                                                                onClick={() => moveCardBetweenLessons(lessonIdx(), cardIdx(), -1)}
                                                            >
                                                                ↑
                                                            </button>
                                                        </div>

                                                        <div class="horizontal-controls">
                                                            <button disabled={cardIdx() === 0}
                                                                onClick={() => moveCard(lessonIdx(), cardIdx(), -1)}
                                                            >
                                                                ←
                                                            </button>

                                                            <Card card={card}
                                                                lesson={lessons()[lessonIdx()]}
                                                                ondblclick={() =>
                                                                    setEditingCardInfo({
                                                                        lessonIdx: lessonIdx(),
                                                                        cardIdx: cardIdx()
                                                                    })
                                                                } />

                                                            <button disabled={cardIdx() === lesson.cards.length - 1}
                                                                onClick={() => moveCard(lessonIdx(), cardIdx(), 1)}
                                                            >
                                                                →
                                                            </button>
                                                        </div>

                                                        <div class="vertical-controls bottom-controls">
                                                            <button onClick={() => moveCardBetweenLessons(lessonIdx(), cardIdx(), 1)}
                                                                disabled={lessonIdx() === lessons().length - 1}
                                                            >
                                                                ↓
                                                            </button>
                                                        </div>

                                                    </div>)}
                                            </For>
                                        </div>
                                    </section>
                                )}
                            </For>
                        </div>
                    </article>
                </aside>
            </Show>

            <Show when={editingCardInfo()}>
                <EditCardModal
                    card={
                        lessons()[
                            editingCardInfo()!.lessonIdx
                        ].cards[
                        editingCardInfo()!.cardIdx
                        ]
                    }
                    onSave={(updatedCard) => {
                        const data = [...lessons()];
                        data[editingCardInfo()!.lessonIdx].cards[editingCardInfo()!.cardIdx] = updatedCard;
                        setLessons(data);
                        persist(data);
                        setEditingCardInfo(null);
                    }}
                    onCancel={() => setEditingCardInfo(null)}
                />
            </Show>
        </>
    );
}
