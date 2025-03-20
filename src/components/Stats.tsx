import { t } from '../i18n';
import './Stats.css';

interface StatsProps {
    incorrectAnswers: number;
    correctAnswers: number;
    questionsAnswered: number;
}

const Stats = (props: StatsProps) => {
    if (!props.incorrectAnswers && !props.questionsAnswered) {
        return '';
    }

    return (
        <span class="stats">
            <h2>{t('progress')}</h2>

            <span class="correct-answers" title={t('corect_answers_alt')}>
                <span class='correct-answers-alt'>
                    {t('correct_answer_count_alt')}
                </span>
                <span class='correct-answers-value'>
                    {props.correctAnswers}
                </span>
            </span>

            <span class="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                <span class='incorrect-answers-alt'>
                    {t('incorrect_answer_count_alt')}
                </span>
                <span class='incorrect-answers-value'>
                    {props.incorrectAnswers}
                </span>
            </span>

            <span class="questions-answered" title={t('questions_answered_count_alt')}>
                <span class='questions-answered-alt'>
                    {t('questions_answered_count_alt')}
                </span>
                <span class='questions-answered-value'>
                    {props.questionsAnswered}
                </span>
            </span>
        </span >
    );
}

export default Stats;