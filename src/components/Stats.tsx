import './Stats.css';
import { createSignal, createEffect } from 'solid-js';
import * as state from "../global-state/lessons";
import { useI18n } from '../contexts/I18nProvider';

const Stats = () => {
    const { t } = useI18n();
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
        <section class="stats-component">
            <h2>{t('progress')}</h2>

            <table>
                <tbody>
                    <tr class="correct-answers" title={t('corect_answers_alt')}>
                        <th class='correct-answers-alt'>
                            {t('correct_answer_count_alt')}
                        </th>
                        <td class='correct-answers-value'>
                            {totalCorrectAnswers()}
                        </td>
                    </tr>

                    <tr class="incorrect-answers" title={t('incorrect_answer_count_alt')}>
                        <th class='incorrect-answers-alt'>
                            {t('incorrect_answer_count_alt')}
                        </th>
                        <td class='incorrect-answers-value'>
                            {totalIncorrectAnswers()}
                        </td>
                    </tr>

                    <tr class="questions-answered" title={t('questions_answered_count_alt')}>
                        <th class='questions-answered-alt'>
                            {t('questions_answered_count_alt')}
                        </th>
                        <td class='questions-answered-value'>
                            {totalQuestionsAnswered()}
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>
    );
};

export default Stats;
