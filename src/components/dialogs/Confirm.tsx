import { createEffect, onCleanup } from 'solid-js';
import { t } from '../../i18n';
import './Confirm.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    // Handle key events when dialog is open
    createEffect(() => {
        if (props.isOpen) {
            const handleKeys = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    console.log('confirm dialog captured enter key');
                    props.onConfirm();
                } else if (e.key === 'Escape') {
                    props.onCancel();
                }
            };

            window.addEventListener('keyup', handleKeys);
            onCleanup(() => window.removeEventListener('keyup', handleKeys));
        }
    });

    if (!props.isOpen) {
        return null;
    }

    return (
        <div class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <p>{props.message}</p>
                <footer>
                    <button class="cancel-button" onClick={props.onCancel}>{t('no')}</button>
                    <button class="next-button" onClick={props.onConfirm}>{t('yes')}</button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmDialog;
