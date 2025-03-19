import { useTranslation } from "react-i18next";
import './Stats.css';

interface StatsProps {
    incorrectAnswers: number;
    correctAnswers: number;
    questionsAnswered: number;
}

const Stats = ({ correctAnswers, incorrectAnswers, questionsAnswered }: StatsProps) => {
    const { t } = useTranslation();

    if (!incorrectAnswers && !questionsAnswered) {
        return '';
    }

    return (
        <span className="stats">
            <h2>{t('progress')}</h2>

            <span className="correct-answers" title={t('corect_answers_alt')}>
                <span className='correct-answers-alt'>
                    {t('correct_answer_count_alt')}
                </span>
                <span className='correct-answers-value'>
                    {correctAnswers}
                </span>
            </span>

            <span className="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                <span className='incorrect-answers-alt'>
                    {t('incorrect_answer_count_alt')}
                </span>
                <span className='incorrect-answers-value'>
                    {incorrectAnswers}
                </span>
            </span>

            <span className="questions-answered" title={t('questions_answered_count_alt')}>
                <span className='questions-answered-alt'>
                    {t('questions_answered_count_alt')}
                </span>
                <span className='questions-answered-value'>
                    {questionsAnswered}
                </span>
            </span>
        </span >
    );
}

export default Stats;