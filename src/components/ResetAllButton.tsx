/* ResetAllButton */

import { createMemo } from "solid-js";
import { t } from "../i18n";
import { resetAll, getTotalQuestionsAnswered } from "../Lessons/state";
import { useConfirm } from "../contexts/Confirm";

export const ResetAllButtonComponent = () => {
    const { showConfirm } = useConfirm();
    const totalAnswered = createMemo(() => getTotalQuestionsAnswered());

    return (<button onClick={() => showConfirm(t('lose_progress', { totalAnswered: totalAnswered() }), resetAll)}
        disabled={totalAnswered() === 0}
    >
        {t('reset_all')}
    </button>
    );
}

export default ResetAllButtonComponent;
