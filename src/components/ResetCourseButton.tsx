import { createMemo, createResource } from "solid-js";
import { useLessonStore } from "../global-state/lessons";
import { useConfirm } from "../contexts/ConfirmProvider";
import { useI18n } from "../contexts/I18nProvider";
import { useCourseStore, type ICourseStore } from "../global-state/course";

export const ResetCourseButtonComponent = () => {
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());
    const { t } = useI18n();
    const lessonStore = useLessonStore();
    const { showConfirm } = useConfirm();
    const totalAnswered = createMemo(() => lessonStore!.getTotalQuestionsAnswered());

    const onConfirmed = () => {
        if (courseStore.loading) return;
        courseStore()!.reset();
        window.location.reload();
    }

    if (totalAnswered() === 0) {
        return '';
    }

    return (
        <button class='reset-course' onClick={() =>
            showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), onConfirmed)}
        >
            {t('reset_course')}
        </button>
    );
}

export default ResetCourseButtonComponent;
