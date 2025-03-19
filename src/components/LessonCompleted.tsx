import { useTranslation } from "react-i18next";
import { formatDuration } from "../lib/format-duration";

import './LessonCompleted.css';

interface LessonCompletedComponent {
    questionCount: number;
    mistakeCount: number;
    durationInSeconds: number;
    onContinue: () => void;
}

const LessonCompletedComponent = ({ durationInSeconds, questionCount, mistakeCount, onContinue }: LessonCompletedComponent) => {
    const { t } = useTranslation();

    return (
        <>
            <section className='card lesson-completed'>
                <h2>{t('lesson_completed')}</h2>
                <p>
                    {
                        t(
                            'lesson_completed_counts',
                            {
                                questionCount,
                                mistakeCount,
                                duration: formatDuration(t, durationInSeconds)
                            }
                        )
                    }
                </p>
                <footer>
                    {/* <button className='next-button' onClick={onContinue}>{t('next_lesson')}</button> */}
                    <button className='next-button' onClick={onContinue}>{t('continue')}</button>
                </footer>
            </section >
        </>
    );
}

export default LessonCompletedComponent;