import { createSignal } from 'solid-js';
import { t } from '../i18n';
import * as state from "../Lessons/state";
import './Stats.css';

const [totalCorrectAnswers] = createSignal<number>(state.getTotalCorrectAnswers());
const [totalIncorrectAnswers] = createSignal<number>(state.getTotalIncorrectAnswers());
const [totalQuestionsAnswered] = createSignal<number>(state.getTotalQuestionsAnswered());

const Stats = () => {
    if (!totalQuestionsAnswered()) {
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
                    {totalCorrectAnswers()}
                </span>
            </span>

            <span class="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                <span class='incorrect-answers-alt'>
                    {t('incorrect_answer_count_alt')}
                </span>
                <span class='incorrect-answers-value'>
                    {totalIncorrectAnswers()}
                </span>
            </span>

            <span class="questions-answered" title={t('questions_answered_count_alt')}>
                <span class='questions-answered-alt'>
                    {t('questions_answered_count_alt')}
                </span>
                <span class='questions-answered-value'>
                    {totalQuestionsAnswered()}
                </span>
            </span>
        </span >
    );
}

export default Stats;