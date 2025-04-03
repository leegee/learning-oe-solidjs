import { For } from 'solid-js';
// import { t } from '../../i18n';
import { type CourseMetadata, type LessonSummary } from "../../global-state/course";
import './LessonList.css';

interface LessonListProps {
    lessons: LessonSummary[];
    currentLessonIndex: number;
    courseMetadata: CourseMetadata;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = (props: LessonListProps) => {
    const onLessonSelectedLocal = (lessonIndex: number) => {
        props.onLessonSelected(lessonIndex);
    };

    if (!props.courseMetadata) {
        return '';
    }

    return (
        <section class="card lesson-list">
            <h2>
                {props.courseMetadata.courseTitle}
            </h2>
            <ol>
                <For each={props.lessons}>
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
                                <span class='index'>{index() + 1}</span>
                                {lessonSummary.title}
                            </button>
                        </li>
                    )}
                </For>
            </ol>
        </section>
    );
};

export default LessonList;
