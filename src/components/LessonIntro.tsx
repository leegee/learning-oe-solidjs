import { JSX } from 'solid-js';
import { t } from '../i18n';
import './LessonIntro.css';

interface LessonIntroProps {
    title: string;
    description?: string;
    index: number;
    children?: JSX.Element;
    onContinue: () => void;
}

const LessonIntro = ({ title, description, index, children, onContinue }: LessonIntroProps) => {

    return (
        <article class="lesson-intro">
            <section class="card">
                <h2>
                    {t('lesson')} {index + 1}
                </h2>
                <h3>{title}</h3>
                {description && (<p class="description">{description}</p>)}
                <div class="buttons">
                    <button class='next-button' onClick={onContinue}>{t('begin')}</button>
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
