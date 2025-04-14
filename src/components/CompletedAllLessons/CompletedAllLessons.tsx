import './CompletedAllLessons.css';
import { JSX } from 'solid-js';
import { useI18n } from '../../contexts/I18nProvider';
import ResetCourseButtonComponent from "../../routes/lessons/ResetCourseButton";

interface CompletedAllLessonsProps {
    totalLessons: number;
    children?: JSX.Element
}

const CompletedAllLessons = (props: CompletedAllLessonsProps) => {
    const { t } = useI18n();

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
