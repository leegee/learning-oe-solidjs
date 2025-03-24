import { createContext, useContext, createSignal } from "solid-js";
import { t } from '../i18n';
import "./Confirm.css";

const ConfirmContext = createContext<{ showConfirm: (message: string, action: () => void) => void }>();

export const ConfirmProvider = (props: { children: any }) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [confirmAction, setConfirmAction] = createSignal<() => void>(() => void (0));
    const [message, setMessage] = createSignal("");

    const showConfirm = (msg: string, action: () => void) => {
        setMessage(msg);
        setConfirmAction(() => action);
        setIsOpen(true);
    };

    const confirm = () => {
        confirmAction()();
        setIsOpen(false);
    };

    const cancel = () => {
        setIsOpen(false);
    };

    return (
        <ConfirmContext.Provider value={{ showConfirm }}>
            {props.children}
            <div class="confirm-dialog-overlay" style={{ display: isOpen() ? "flex" : "none" }}>
                <dialog class="confirm-dialog" open={isOpen()}>
                    <h3>{message()}</h3>
                    <footer>
                        <button class="cancel-button" onClick={cancel}>{t('no')}</button>
                        <button class="next-button" onClick={confirm}>{t('yes')}</button>
                    </footer>
                </dialog>
            </div>
        </ConfirmContext.Provider>
    );
};

// ✅ Export useConfirm so other components can use it
export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context;
};
