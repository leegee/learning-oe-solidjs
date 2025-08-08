import './CourseScoreProgressBar.css';
import { useI18n } from '../contexts/I18nProvider';
import { getCourseStore } from '../global-state/course';

export interface IProgressBarProps {
    correct: number;
}

const ProgressBarPercentageOfX = (props: IProgressBarProps) => {
    const { t } = useI18n();
    const courseStore = getCourseStore();
    const total = courseStore.getTotalQuestionsCount();

    return (
        <aside class="course-score-progress-component">
            <progress
                class="course-score-progress-bar"
                max={total}
                value={props.correct}
                aria-label={t('course_score_so_far')}
            >
                {props.correct}/{total}
            </progress>
        </aside>
    );
};

export default ProgressBarPercentageOfX;
