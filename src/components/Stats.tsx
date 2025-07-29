import './Stats.css';
import { useLessonStore } from "../global-state/answers";
import { useI18n } from '../contexts/I18nProvider';
import ProgressBarPercentageOfX from './ProgressBarPercentageOfX';
import { createMemo, createResource } from 'solid-js';
import { type ICourseStore, useCourseStore } from '../global-state/course';

export interface IStatsProps {
    courseIdx: number;
}

const Stats = (props: IStatsProps) => {
    const { t } = useI18n();
    const lessonStore = createMemo(() => useLessonStore(props.courseIdx));
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    if (!lessonStore() || !lessonStore().getTotalQuestionsAnswered()) {
        return null;
    }

    const lessonIndex = createMemo(() => lessonStore().getTotalQuestionsAnswered());
    const totalLessons = createMemo(() => courseStore()?.getTotalLessonsCount() ?? 0);

    return (
        <section class="stats-component card">
            <h2>{t('progress')}</h2>

            <ProgressBarPercentageOfX
                correct={lessonIndex()}
                incorrect={totalLessons()}
            />

            <table class="horizontal-stats">
                <thead>
                    <tr>
                        <th class="correct-answers" title={t('corect_answers_alt')}>
                            {t('correct_answer_count_alt')}
                        </th>
                        <th class="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                            {t('incorrect_answer_count_alt')}
                        </th>
                        <th class="questions-answered" title={t('questions_answered_count_alt')}>
                            {t('questions_answered_count_alt')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            {lessonStore().getTotalCorrectAnswers()}
                        </td>
                        <td>
                            {lessonStore().getTotalIncorrectAnswers()}
                        </td>
                        <td>
                            {lessonStore().getTotalQuestionsAnswered()}
                        </td>
                    </tr>
                </tbody>
            </table>

        </section>
    );
};

export default Stats;
