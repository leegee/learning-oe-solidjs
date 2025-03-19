import { JSX } from 'solid-js';
import { t } from '../i18n';
import './CompletedAllLessons.css';

interface CompletionSummaryProps {
    totalLessons: number;
    children: JSX.Element
}

const CompletedAllLessons = ({
    totalLessons,
    children,
}: CompletionSummaryProps) => {

    // todo rephrase
    return (
        <>
            <article class="completed-all-lessons">
                <h2>{t('all_lessons_done')}</h2>
                <p>{t('total_lessons_completed')}: <strong>{totalLessons}</strong></p>
            </article>

            {children}
        </>
    );
};

export default CompletedAllLessons;
