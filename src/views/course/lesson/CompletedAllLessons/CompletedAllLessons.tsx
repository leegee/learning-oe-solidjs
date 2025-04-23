import './CompletedAllLessons.css';
import { type JSX } from 'solid-js';
import { useI18n } from '../../../../contexts/I18nProvider';
import ResetCourseButtonComponent from '../../../../components/ResetCourseButton';
import { useParams } from '@solidjs/router';

interface CompletedAllLessonsProps {
    children?: JSX.Element
}

const CompletedAllLessons = (props: CompletedAllLessonsProps) => {
    const { t } = useI18n();
    const params = useParams();

    // todo 
    return (
        <>
            <section class="completed-all-lessons card">
                <h2>{t('all_lessons_done')}</h2>
                <div class='stats'>
                    {/* <p>{t('total_lessons_completed')}: <strong>{props.totalLessons}</strong></p> */}
                </div>
                {props.children && props.children}
                <ResetCourseButtonComponent courseIdx={Number(params.courseIdx || -1)} />
            </section>

        </>
    );
};

export default CompletedAllLessons;
