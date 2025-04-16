import { For, Show } from 'solid-js';
import { courseStore } from "../../../global-state/course";
import './LessonList.css';

interface LessonListProps {
    currentLessonIndex: number;
    courseIndex: number;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const onLessonSelectedLocal = (lessonIndex: number) => {
        props.onLessonSelected(lessonIndex);
    };

    const lessonSummaries = () => courseStore.lessonTitles2Indicies();
    const courseMetadata = () => courseStore.store.courseMetadata;

    return (
        <Show when={courseMetadata()} fallback={<div>Loading lesson list...</div>}>
            {(metadata) => (
                <section class="card lesson-list">
                    <h2>{metadata().courseTitle}</h2>
                    <ol>
                        <For each={lessonSummaries()}>
                            {(lessonSummary, index) => (
                                <li>
                                    <button
                                        disabled={index() > props.currentLessonIndex}
                                        onClick={() => {
                                            if (index() <= props.currentLessonIndex) {
                                                onLessonSelectedLocal(index());
                                            }
                                        }}
                                        class={[
                                            index() < props.currentLessonIndex && 'completed',
                                            index() === props.currentLessonIndex && 'current',
                                            index() > props.currentLessonIndex && 'todo'
                                        ].filter(Boolean).join(' ')}
                                    >
                                        {lessonSummary.title}
                                    </button>
                                </li>
                            )}
                        </For>
                    </ol>
                </section>
            )}
        </Show>
    );
};

export default LessonList;
