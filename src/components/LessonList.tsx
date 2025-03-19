// components/dialogs/LessonList.tsx

import { useTranslation } from "react-i18next";
import { LessonSummary } from "../Lessons";
import './LessonList.css';

interface LessonListProps {
    lessons: LessonSummary[];
    currentLessonIndex: number;
    onLessonSelected: (lessonIndex: number) => void;
}

const LessonList = ({ lessons, currentLessonIndex, onLessonSelected }: LessonListProps) => {
    const { t } = useTranslation();

    const onLessonSelectedLocal = (lessonIndex: number) => {
        onLessonSelected(lessonIndex);
    };

    return (
        <section className="card lesson-list">
            <h2>{t('list_lessons_title')}</h2>
            <ol >
                {lessons.map((lessonSummary, index) => (
                    <li key={index}>
                        <button
                            {...(index > currentLessonIndex && { disabled: true })}
                            onClick={() => { if (index <= currentLessonIndex) { onLessonSelectedLocal(index) } }}
                            className={[
                                index < currentLessonIndex && 'completed',
                                index === currentLessonIndex && 'current',
                                index > currentLessonIndex && 'todo'
                            ].filter(Boolean).join(' ')}
                        >
                            <span className='index'>{index + 1}</span>
                            {lessonSummary.title}
                        </button>
                    </li>
                ))}
            </ol>
        </section >
    );
};

export default LessonList;
