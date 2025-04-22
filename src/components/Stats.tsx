import './Stats.css';
import { useLessonStore } from "../global-state/lessons";
import { useI18n } from '../contexts/I18nProvider';

export interface IStatsProps {
    courseIdx: number;
}

const Stats = (props: IStatsProps) => {
    const { t } = useI18n();
    const lessonStore = useLessonStore(props.courseIdx);

    if (!lessonStore || !lessonStore.getTotalQuestionsAnswered()) {
        return '';
    }

    return (
        <section class="stats-component">
            <h2>{t('progress')}</h2>

            <table>
                <tbody>
                    <tr class="correct-answers" title={t('corect_answers_alt')}>
                        <th class='correct-answers-alt'>
                            {t('correct_answer_count_alt')}
                        </th>
                        <td class='correct-answers-value'>
                            {lessonStore.getTotalCorrectAnswers()}
                        </td>
                    </tr>

                    <tr class="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                        <th class='incorrect-answers-alt'>
                            {t('incorrect_answer_count_alt')}
                        </th>
                        <td class='incorrect-answers-value'>
                            {lessonStore.getTotalQuestionsAnswered()}
                        </td>
                    </tr>

                    <tr class="questions-answered" title={t('questions_answered_count_alt')}>
                        <th class='questions-answered-alt'>
                            {t('questions_answered_count_alt')}
                        </th>
                        <td class='questions-answered-value'>
                            {lessonStore.getTotalQuestionsAnswered()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Stats;
