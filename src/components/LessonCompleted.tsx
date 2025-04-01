import { t } from '../i18n';
import { formatDuration } from "../lib/format-duration";
import { getCurrentLessonIndex, getLessonQuestionsAnsweredIncorrectly, getLessonQuestionCount } from '../lessons-state';

import './LessonCompleted.css';

interface LessonCompletedComponentProps {
    durationInSeconds: number;
    onNext: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponentProps) => {
    const idx = getCurrentLessonIndex();
    const incorrectAnswerCount = getLessonQuestionsAnsweredIncorrectly(idx);
    const questionCount = getLessonQuestionCount(idx);

    return (
        <>
            <section class='card lesson-completed'>
                <h2>{t('lesson_completed')}</h2>
                <p>
                    {t('lesson_completed_counts',
                        {
                            questionCount: questionCount,
                            incorrectAnswerCount: incorrectAnswerCount,
                            duration: formatDuration(t, props.durationInSeconds)
                        }
                    )}
                </p>
                <footer>
                    <button class='next-button' onClick={props.onNext}>{t('continue')}</button>
                </footer>
            </section>
        </>
    );
}

export default LessonCompletedComponent;
