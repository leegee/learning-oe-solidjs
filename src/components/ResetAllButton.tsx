/* ResetAllButton */

import { t } from "../i18n";
import { resetAll, getTotalQuestionsAnswered } from "../Lessons/state";
// import ConfirmDialog from "./dialogs/Confirm";

export const ResetAllButtonComponent = () => {
    return (<button
        disabled={getTotalQuestionsAnswered() > 0}
        onClick={resetAll}
    >
        {t('reset_all')}
    </button>
    );
}

export default ResetAllButtonComponent;
