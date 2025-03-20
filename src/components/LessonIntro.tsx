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

const LessonIntro = (props: LessonIntroProps) => {

    return (
        <article class="lesson-intro">
            <section class="card">
                <header>
                    <h2>
                        {t('lesson')} {props.index + 1}
                    </h2>
                    <h3>{props.title}</h3>
                </header>

                {props.description && (<p class="description">{props.description}</p>)}

                <footer>
                    <button class='next-button' onClick={props.onContinue}>{t('begin')}</button>
                </footer>
            </section>

            {props.children && (
                <>
                    {props.children}
                </>
            )}
        </article >
    );
};

export default LessonIntro;
