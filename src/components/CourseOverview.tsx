import { createSignal, For, Show } from "solid-js";
import Card from "./Card";
import { type Lesson } from "./Lesson";
import './CourseOverview.css';

export default function CourseOverview(props: { lessons: Lesson[] }) {
    const [open, setOpen] = createSignal(false);

    const toggle = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen(!open());
    };

    return (
        <>
            <button class="course-overview-button" onClick={toggle}>
                <small>Show All Cards For This Course</small>
            </button>

            <Show when={open()}>
                <aside class="modal-bg">
                    <article class="course-overview" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                        <header>
                            <div>
                                <h2>Course Overview</h2>
                                <h3>All Lessons and Cards</h3>
                            </div>
                            <button onClick={toggle}>✕</button>
                        </header>

                        <div class="lessons">
                            <For each={props.lessons}>
                                {(lesson) => (
                                    <section>
                                        <header>
                                            <h4>{lesson.title}</h4>
                                            <h5>{lesson.description}</h5>
                                        </header>
                                        <div class="cards">
                                            <For each={lesson.cards}>
                                                {(card) => (
                                                    <div class="card-holder">
                                                        <Card card={card} />
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </section>
                                )}
                            </For>
                        </div>
                    </article>
                </aside>
            </Show>
        </>
    );
}
