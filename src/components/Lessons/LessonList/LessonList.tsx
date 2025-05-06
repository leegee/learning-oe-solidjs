import './LessonList.css';
import { createResource, For, JSX, Show } from 'solid-js';
import { useCourseStore, type ICourseStore } from "../../../global-state/course";
import { useLessonStore } from '../../../global-state/answers';

interface LessonListProps {
    courseIndex: number;
    children: JSX.Element;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const lessonStore = useLessonStore(props.courseIndex);

    return (
        <Show when={!courseStore.loading} fallback={<div>Loading lesson list...</div>}>
            <section class="card lesson-list">

                {props.children}

                <Show
                    when={(courseStore()?.getLessons()?.length ?? 0) > 0}
                    fallback={<p class="card">No lessons are available for this course.</p>}
                >
                    <ol>
                        <For each={courseStore()?.getLessons() ?? []}>
                            {(lesson, index) => {
                                const idx = index();
                                const currentIdx = lessonStore.getCurrentLessonIdx();
                                return (
                                    <li>
                                        <button
                                            disabled={idx > currentIdx}
                                            onClick={() => {
                                                if (idx <= currentIdx) {
                                                    props.onLessonSelected(idx);
                                                }
                                            }}
                                            classList={{
                                                completed: idx < currentIdx,
                                                current: idx === currentIdx,
                                                todo: idx > currentIdx
                                            }}
                                            title={lesson.description || ''}
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
