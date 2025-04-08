import { createSignal, For, Show } from "solid-js";
import Card from "./Card";
import './CourseOverview.css';

export default function CourseOverview(props: { lesson: any }) {
    const [open, setOpen] = createSignal(false);

    const toggle = (e: MouseEvent) => {
        e.stopPropagation();
        setOpen(!open());
    }

    return (
        <>
            <button class="course-overview-button" onClick={toggle}>
                <small>Show All Cards For This Course</small>
            </button>

            <Show when={open()}>
                <div class='modal-bg'>
                    <article class='course-overview'>
                        <header>
                            <h2>Lesson Overview</h2>
                            <button onClick={toggle} > ✕ </button>
                        </header>

                        <section class='cards'>
                            <For each={props.lesson.cards}>
                                {(card, index) => (
                                    <div class="card-holder" >
                                        <Card card={card} />
                                    </div>
                                )}
                            </For>
                        </section>
                    </article>
                </div>
            </Show>
        </>
    );
}
