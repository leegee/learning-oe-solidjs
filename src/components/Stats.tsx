import { createSignal, createEffect } from 'solid-js';
import { t } from '../i18n';
import * as state from "../global-state/lessons";
import './Stats.css';

const Stats = () => {
    const [totalCorrectAnswers, setTotalCorrectAnswers] = createSignal<number>(state.getTotalCorrectAnswers());
    const [totalIncorrectAnswers, setTotalIncorrectAnswers] = createSignal<number>(state.getTotalIncorrectAnswers());
    const [totalQuestionsAnswered, setTotalQuestionsAnswered] = createSignal<number>(state.getTotalQuestionsAnswered());

    createEffect(() => {
        setTotalCorrectAnswers(state.getTotalCorrectAnswers());
        setTotalIncorrectAnswers(state.getTotalIncorrectAnswers());
        setTotalQuestionsAnswered(state.getTotalQuestionsAnswered());
    });

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
        </span>
    );
};

export default Stats;
