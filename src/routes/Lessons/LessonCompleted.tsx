import { t } from '../../lib/i18n';
import { formatDuration } from "../../lib/format-duration";
import { getCurrentLessonIndex, getLessonQuestionsAnsweredIncorrectly, getLessonQuestionCount } from '../../global-state/lessons';
import { exitFullscreen } from '../../lib/fullscreen';

import './LessonCompleted.css';

interface LessonCompletedComponentProps {
    durationInSeconds: number;
    onNext: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponentProps) => {
    const idx = getCurrentLessonIndex();
    const incorrectAnswerCount = getLessonQuestionsAnsweredIncorrectly(idx);
    const questionCount = getLessonQuestionCount(idx);

    const handleClick = () => {
        exitFullscreen();
        props.onNext();
    }

    return (
        <>
            <section class='lesson-completed card'>
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
            </section>
            <footer class='lesson-completed-footer'>
                <button class='next-button' onClick={handleClick}>{t('continue')}</button>
            </footer>
        </>
    );
}

export default LessonCompletedComponent;
