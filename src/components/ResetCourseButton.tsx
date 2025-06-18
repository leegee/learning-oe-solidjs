import { createMemo, createResource } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useLessonStore } from "../global-state/answers";
import { useConfirm } from "../contexts/ConfirmProvider";
import { useI18n } from "../contexts/I18nProvider";
import { useCourseStore, type ICourseStore } from "../global-state/course";
import { resetCourse } from "../global-state/lessons.localStorage";

export interface IResetCourseButtonComponentProps {
    courseIdx: number;
}

export const ResetCourseButtonComponent = (props: IResetCourseButtonComponentProps) => {
    const { t } = useI18n();
    const navigate = useNavigate();
    const { showConfirm } = useConfirm();
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const lessonStore = useLessonStore(props.courseIdx);
    const totalAnswered = createMemo(() => lessonStore!.getTotalQuestionsAnswered());

    const onConfirmed = () => {
        if (courseStore.loading) return;
        resetCourse();
        navigate('/course/' + props.courseIdx);
    }

    if (totalAnswered() === 0) {
        return '';
    }

    return (
        <button class='large-icon-button' onClick={() =>
            showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), onConfirmed)}
        >
            <i class="utf8-icon-reset" title={t('reset_course')} />
        </button>
    );
}

export default ResetCourseButtonComponent;
