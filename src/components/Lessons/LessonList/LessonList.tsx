import './LessonList.css';
import { createMemo, For, JSX, Show } from 'solid-js';
import { getCourseStore } from "../../../global-state/course";
import { useLessonStore } from '../../../global-state/answers';

interface LessonListProps {
    courseIndex: number;
    children?: JSX.Element;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const courseStore = getCourseStore();
    const lessonStore = createMemo(() => useLessonStore(props.courseIndex));

    return (
        <Show when={courseStore} fallback={<div>Loading lesson list...</div>}>
            <section class="card lesson-list">

                {props.children}

                <Show
                    when={(courseStore.getLessons()?.length ?? 0) > 0}
                    fallback={<p class="card">No lessons are available for this course.</p>}
                >
                    <ol>
                        <For each={courseStore.getLessons() ?? []}>
                            {(lesson, index) => {
                                const idx = index();
                                const done = lessonStore().isLessonDone(idx);

                                // Find first incomplete lesson index
                                const lessons = courseStore.getLessons() ?? [];
                                const firstIncompleteIdx = lessons.findIndex((_, i) => !lessonStore().isLessonDone(i));

                                // If all done, firstIncompleteIdx === -1, so highlight last lesson as current
                                const currentIdx = firstIncompleteIdx === -1 ? lessons.length - 1 : firstIncompleteIdx;

                                const isNext = idx === currentIdx && !done;
                                const isTodo = idx > currentIdx && !done;

                                return (
                                    <li>
                                        <button
                                            onClick={() => props.onLessonSelected(idx)}
                                            classList={{
                                                current: isNext,
                                                todo: isTodo,
                                                completed: done,
                                            }}
                                            title={lesson.description || ''}
                                            aria-current={isNext ? "step" : undefined}
                                        >
                                            {lesson.title}
                                        </button>
                                    </li>
                                );
                            }}
                        </For>
                    </ol>
                </Show>

            </section>
        </Show>
    );
};

export default LessonList;
