import './CompletedAllLessons.css';
import { type JSX } from 'solid-js';
import { useI18n } from '../../../../contexts/I18nProvider';
import ResetCourseButtonComponent from '../../../../components/ResetCourseButton';
import { useNavigate, useParams } from '@solidjs/router';
import LessonList from '../../../../components/Lessons/LessonList';

interface CompletedAllLessonsProps {
    children?: JSX.Element
}

const CompletedAllLessons = (props: CompletedAllLessonsProps) => {
    const { t } = useI18n();
    const navigate = useNavigate();

    const params = useParams();

    const onLessonSelected = (lessonIndex: number) => {
        navigate(`/course/${params.courseIdx}/${lessonIndex}/intro`);
    };

    // todo 
    return (
        <>
            <section class="completed-all-lessons card">
                <h2>{t('all_lessons_done')}</h2>

                <LessonList
                    onLessonSelected={onLessonSelected}
                    courseIndex={Number(params.courseIdx)}
                />

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
