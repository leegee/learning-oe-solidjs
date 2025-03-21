import { t } from '../i18n';
import { formatDuration } from "../lib/format-duration";
import { currentLessonIndex, countLessonAnswersIncorrect, getLessonQuestionCount } from '../Lessons/state';

import './LessonCompleted.css';

interface LessonCompletedComponent {
    durationInSeconds: number;
    onLessonComplete: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponent) => {
    const idx = currentLessonIndex();
    const incorrectAnswerCount = countLessonAnswersIncorrect(idx);
    const questionCount = getLessonQuestionCount(idx);

    return (
        <>
            <section class='card lesson-completed'>
                <h2>{t('lesson_completed')}</h2>
                <p>
                    {
                        t(
                            'lesson_completed_counts',
                            {
                                questionCount: questionCount,
                                incorrectAnswerCount: incorrectAnswerCount,
                                duration: formatDuration(t, props.durationInSeconds)
                            }
                        )
                    }
                </p>
                <footer>
                    {/* Keep the same button as before */}
                    <button class='next-button' onClick={props.onLessonComplete}>{t('continue')}</button>
                </footer>
            </section>
        </>
    );
}

export default LessonCompletedComponent;
