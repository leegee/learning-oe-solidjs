import './LessonCompleted.css';
import { useParams } from '@solidjs/router';
import { TFunction } from 'i18next';
import { useI18n } from '../../contexts/I18nProvider';
import { useLessonStore } from '../../global-state/answers';
import { formatDuration } from "../../lib/format-duration";
import { exitFullscreen } from '../../lib/fullscreen';

interface LessonCompletedComponentProps {
    lessonDurationInSeconds: number;
    onNext: () => void;
}

const LessonCompletedComponent = (props: LessonCompletedComponentProps) => {
    const { t } = useI18n();
    const params = useParams();
    const lessonStore = useLessonStore(Number(params.courseIdx || -1));
    const lessonIdx = lessonStore!.getCurrentLessonIdx();
    const incorrectAnswerCount = lessonStore!.getTotalWrongAttemptsInLesson(lessonIdx);
    const questionCount = lessonStore!.getLessonQuestionCount(lessonIdx);

    const handleNext = () => {
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
                            duration: formatDuration(t as TFunction, props.lessonDurationInSeconds)
                        }
                    )}
                </p>
            </section>
            <footer class='lesson-completed-footer'>
                <button class='next-button' onClick={handleNext}>{t('continue')}</button>
            </footer>
        </>
    );
}

export default LessonCompletedComponent;
