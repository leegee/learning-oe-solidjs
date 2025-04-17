import { createResource, For, Show } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../../global-state/course";
import './LessonList.css';

interface LessonListProps {
    currentLessonIndex: number;
    courseIndex: number;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    const onLessonSelectedLocal = (lessonIndex: number) => {
        props.onLessonSelected(lessonIndex);
    };

    return (
        <Show when={!courseStore.loading} fallback={<div>Loading lesson list...</div>}>
            {/* Now store is guaranteed to be loaded */}
            <Show when={courseStore()?.store?.courseMetadata} fallback={<div>Loading course data...</div>}>
                {(metadata) => {
                    const lessons = courseStore()?.store?.lessons;

                    return (
                        <section class="card lesson-list">
                            <h2>{metadata().courseTitle}</h2>
                            <ol>
                                <For each={lessons}>
                                    {(lesson, index) => (
                                        <li>
                                            <button
                                                disabled={index() > props.currentLessonIndex}
                                                onClick={() => {
                                                    if (index() <= props.currentLessonIndex) {
                                                        onLessonSelectedLocal(index());
                                                    }
                                                }}
                                                class={[
                                                    index() < props.currentLessonIndex ? 'completed' : '',
                                                    index() === props.currentLessonIndex ? 'current' : '',
                                                    index() > props.currentLessonIndex ? 'todo' : ''
                                                ].join(' ')}
                                            >
                                                {lesson.title}
                                            </button>
                                        </li>
                                    )}
                                </For>
                            </ol>
                        </section>
                    );
                }}
            </Show>
        </Show>
    );
};

export default LessonList;
