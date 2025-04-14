/* ResetAllButton */

import { createMemo } from "solid-js";
import { t } from "../../lib/i18n";
import { resetCourse, getTotalQuestionsAnswered } from "../../global-state/lessons";
import { useConfirm } from "../../contexts/Confirm";

export const ResetCourseButtonComponent = () => {
    const { showConfirm } = useConfirm();
    const totalAnswered = createMemo(() => getTotalQuestionsAnswered());

    const onConfirmed = () => {
        resetCourse();
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
