/* ResetAllButton */

import { createMemo } from "solid-js";
import { t } from "../i18n";
import { resetCourse, getTotalQuestionsAnswered } from "../global-state/lessons";
import { useConfirm } from "../contexts/Confirm";

export const ResetAllButtonComponent = () => {
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
        <button onClick={() =>
            showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), onConfirmed)}
        >
            {t('reset_all')}
        </button>
    );
}

export default ResetAllButtonComponent;
