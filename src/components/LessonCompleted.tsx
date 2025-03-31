import { t } from '../i18n';
import { formatDuration } from "../lib/format-duration";
import { currentLessonIndex, getLessonQuestionsAnsweredIncorrect, getLessonQuestionCount } from '../lessons-state';

import './LessonCompleted.css';

interface LessonCompletedComponentProps {
    durationInSeconds: number;
    onNext: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponentProps) => {
    const idx = currentLessonIndex();
    const incorrectAnswerCount = getLessonQuestionsAnsweredIncorrect(idx);
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
                    <button class='next-button' onClick={props.onNext}>{t('continue')}</button>
                </footer>
            </section>
        </>
    );
}

export default LessonCompletedComponent;
