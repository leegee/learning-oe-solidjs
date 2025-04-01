/* ResetAllButton */

import { createMemo } from "solid-js";
import { t } from "../i18n";
import { resetCourse, getTotalQuestionsAnswered } from "../lessons-state";
import { useConfirm } from "../contexts/Confirm";

export const ResetAllButtonComponent = () => {
    const { showConfirm } = useConfirm();
    const totalAnswered = createMemo(() => getTotalQuestionsAnswered());

    const onConfirmed = () => {
        resetCourse();
        window.location.reload();
    }

    return (<button onClick={() => showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), onConfirmed)}
        disabled={totalAnswered() === 0}
    >
        {t('reset_all')}
    </button>
    );
}

export default ResetAllButtonComponent;
