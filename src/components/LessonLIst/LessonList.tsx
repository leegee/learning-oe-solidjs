import { For } from 'solid-js';
import { t } from '../../i18n';
import { type LessonSummary } from "../../Course";
import './LessonList.css';

interface LessonListProps {
    lessons: LessonSummary[];
    currentLessonIndex: number;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = ({ lessons, currentLessonIndex, onLessonSelected }: LessonListProps) => {
    const onLessonSelectedLocal = (lessonIndex: number) => {
        console.log('LessonList set lesson index to', lessonIndex);
        onLessonSelected(lessonIndex);
    };

    return (
        <section class="card lesson-list">
            <h2>{t('list_lessons_title')}</h2>
            <ol>
                <For each={lessons}>
                    {(lessonSummary, index) => (
                        <li>
                            <button
                                disabled={index() > currentLessonIndex}
                                onClick={() => {
                                    if (index() <= currentLessonIndex) {
                                        onLessonSelectedLocal(index());
                                    }
                                }}
                                class={[
                                    index() < currentLessonIndex && 'completed',
                                    index() === currentLessonIndex && 'current',
                                    index() > currentLessonIndex && 'todo'
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
