import { createMemo, createResource } from "solid-js";
import { useLessonStore } from "../global-state/lessons";
import { useConfirm } from "../contexts/ConfirmProvider";
import { useI18n } from "../contexts/I18nProvider";
import { useCourseStore, type ICourseStore } from "../global-state/course";

export interface IResetCourseButtonComponentProps {
    courseIdx: number;
}

export const ResetCourseButtonComponent = (props: IResetCourseButtonComponentProps) => {
    const { t } = useI18n();
    const { showConfirm } = useConfirm();
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    const lessonStore = useLessonStore();
    const totalAnswered = createMemo(() => lessonStore!.getTotalQuestionsAnswered());

    const onConfirmed = () => {
        if (courseStore.loading) return;
        courseStore()!.reset(props.courseIdx);
        window.location.reload();
    }

    if (totalAnswered() === 0) {
        return '';
    }

    return (
        <button class='large-icon-button' onClick={() =>
            showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), onConfirmed)}
        >
            <i class="icon-ccw" title={t('reset_course')} />
        </button>
    );
}

export default ResetCourseButtonComponent;
