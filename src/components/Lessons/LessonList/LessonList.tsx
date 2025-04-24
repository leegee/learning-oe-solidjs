import './LessonList.css';
import { createResource, For, Show } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../../global-state/course";
import { ILesson } from '../Lesson';

interface LessonListProps {
    currentLessonIndex: number;
    courseIndex: number;
    lessons: ILesson[];
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const [courseStore] = createResource<ICourseStore, true>(useCourseStore);

    const onLessonSelectedLocal = (lessonIndex: number) => {
        props.onLessonSelected(lessonIndex);
    };

    return (
        <Show when={!courseStore.loading} fallback={<div>Loading lesson list...</div>}>
            <Show when={courseStore()?.store?.courseMetadata} fallback={<div>Loading course data...</div>}>
                {(metadata) => {

                    return (
                        <section class="card lesson-list">
                            <h2>{metadata().courseTitle}</h2>
                            <ol>
                                <For each={props.lessons}>
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
