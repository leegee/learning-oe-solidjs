import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import './LessonIntro.css';

interface LessonIntroProps {
    title: string;
    description?: string;
    index: number;
    children?: ReactNode;
    onContinue: () => void;
}

const LessonIntro = ({ title, description, index, children, onContinue }: LessonIntroProps) => {
    const { t } = useTranslation();

    return (
        <article className="lesson-intro">
            <section className="card">
                <h2>
                    {t('lesson')} {index + 1}
                </h2>
                <h3>{title}</h3>
                {description && (<p className="description">{description}</p>)}
                <div className="buttons">
                    <button className='next-button' onClick={onContinue}>{t('begin')}</button>
                </div>
            </section>

            {children && (
                <>
                    {children}
                </>
            )}
        </article >
    );
};

export default LessonIntro;
