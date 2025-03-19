import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import './CompletedAllLessons.css';

interface CompletionSummaryProps {
    totalLessons: number;
    children: ReactNode;
}

const CompletedAllLessons = ({
    totalLessons,
    children,
}: CompletionSummaryProps) => {
    const { t } = useTranslation();

    // todo rephrase
    return (
        <>
            <article className="completed-all-lessons">
                <h2>{t('all_lessons_done')}</h2>
                <p>{t('total_lessons_completed')}: <strong>{totalLessons}</strong></p>
            </article>

            {children}
        </>
    );
};

export default CompletedAllLessons;
