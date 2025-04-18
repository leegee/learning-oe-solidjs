import "./ConfirmProvider.css";
import { createContext, useContext, createSignal, type JSX, Show } from "solid-js";

const ConfirmContext = createContext<{ showConfirm: (message: string, action: () => void) => void }>();

interface IConfirmProviderProps {
    children: JSX.Element;
}

export const ConfirmProvider = (props: IConfirmProviderProps) => {
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
            <Show when={isOpen()}>
                <div class="modal-bg" style={{ display: isOpen() ? "flex" : "none" }}>
                    <dialog class="confirm-dialog" open={isOpen()}>
                        <h3>{message()}</h3>
                        <footer>
                            <button class="cancel-button" onClick={cancel}>
                                ✕
                            </button>
                            <button class="next-button" onClick={confirm}>
                                ✔
                            </button>
                        </footer>
                    </dialog>
                </div>
            </Show>
        </ConfirmContext.Provider>
    );
};

export const useConfirm = () => {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error("useConfirm must be used within a ConfirmProvider");
    }
    return context;
};
