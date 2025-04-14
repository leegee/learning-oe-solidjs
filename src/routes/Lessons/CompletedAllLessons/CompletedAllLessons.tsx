import { JSX } from 'solid-js';
import { t } from '../../../lib/i18n';
import ResetCourseButtonComponent from '../ResetCourseButton';
import './CompletedAllLessons.css';

interface CompletedAllLessonsProps {
    totalLessons: number;
    children?: JSX.Element
}

const CompletedAllLessons = (props: CompletedAllLessonsProps) => {
    // todo 
    return (
        <>
            <section class="completed-all-lessons card">
                <h2>{t('all_lessons_done')}</h2>
                <div class='stats'>
                    <p>{t('total_lessons_completed')}: <strong>{props.totalLessons}</strong></p>
                </div>
                {props.children && props.children}
                <ResetCourseButtonComponent />
            </section>

        </>
    );
};

export default CompletedAllLessons;
