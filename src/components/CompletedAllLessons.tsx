import { JSX } from 'solid-js';
import { t } from '../i18n';
import './CompletedAllLessons.css';

interface CompletedAllLessonsProps {
    totalLessons: number;
    children?: JSX.Element
}

const CompletedAllLessons = (props: CompletedAllLessonsProps) => {
    // todo 
    return (
        <>
            <article class="completed-all-lessons card">
                <h2>{t('all_lessons_done')}</h2>
                <div class='stats'>
                    <p>{t('total_lessons_completed')}: <strong>{props.totalLessons}</strong></p>
                </div>
                {props.children && props.children}
            </article>

        </>
    );
};

export default CompletedAllLessons;
