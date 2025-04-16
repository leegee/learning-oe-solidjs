/* ResetAllButton */

import { createMemo } from "solid-js";
import { useLessonStore } from "../global-state/lessons";
import { useConfirm } from "../contexts/Confirm";
import { useI18n } from "../contexts/I18nProvider";
import { courseStore } from "../global-state/course";

export const ResetCourseButtonComponent = () => {
    const { t } = useI18n();
    const lessonStore = useLessonStore();
    const { showConfirm } = useConfirm();
    const totalAnswered = createMemo(() => lessonStore.getTotalQuestionsAnswered());

    const onConfirmed = () => {
        courseStore.reset();
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
