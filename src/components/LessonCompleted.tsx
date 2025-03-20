import { t } from '../i18n';
import { formatDuration } from "../lib/format-duration";

import './LessonCompleted.css';

interface LessonCompletedComponent {
    questionCount: number;
    mistakeCount: number;
    durationInSeconds: number;
    onLessonComplete: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponent) => {
    return (
        <>
            <section class='card lesson-completed'>
                <h2>{t('lesson_completed')}</h2>
                <p>
                    {
                        t(
                            'lesson_completed_counts',
                            {
                                questionCount: props.questionCount,
                                mistakeCount: props.mistakeCount,
                                duration: formatDuration(t, props.durationInSeconds)
                            }
                        )
                    }
                </p>
                <footer>
                    {/* <button class='next-button' onClick={onContinue}>{t('next_lesson')}</button> */}
                    <button class='next-button' onClick={props.onLessonComplete}>{t('continue')}</button>
                </footer>
            </section >
        </>
    );
}

export default LessonCompletedComponent;