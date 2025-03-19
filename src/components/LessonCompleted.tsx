import { t } from '../i18n';
import { formatDuration } from "../lib/format-duration";

import './LessonCompleted.css';

interface LessonCompletedComponent {
    questionCount: number;
    mistakeCount: number;
    durationInSeconds: number;
    onContinue: () => void;
}

const LessonCompletedComponent = ({ durationInSeconds, questionCount, mistakeCount, onContinue }: LessonCompletedComponent) => {
    return (
        <>
            <section class='card lesson-completed'>
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
                    {/* <button class='next-button' onClick={onContinue}>{t('next_lesson')}</button> */}
                    <button class='next-button' onClick={onContinue}>{t('continue')}</button>
                </footer>
            </section >
        </>
    );
}

export default LessonCompletedComponent;