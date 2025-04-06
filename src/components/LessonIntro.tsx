import { t } from '../i18n';
import { enterFullscreen } from '../lib/fullscreen';
import './LessonIntro.css';

interface LessonIntroProps {
    title: string;
    description?: string;
    index: number;
    onLessonStart: () => void;
}

const LessonIntro = (props: LessonIntroProps) => {
    const handleClick = () => {
        enterFullscreen();
        props.onLessonStart();
    }
    return (
        <>
            <article class="lesson-intro card">
                <header>
                    <h2>
                        {t('lesson')} {props.index + 1}
                    </h2>
                    <h3>{props.title}</h3>
                </header>

                {props.description && (<p class="description">{props.description}</p>)}
            </article >

            <footer class="lesson-intro-footer">
                <button class='next-button' onClick={handleClick}>{t('begin')}</button>
            </footer>
        </>
    );
};

export default LessonIntro;
