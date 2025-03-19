import { createEffect, onCleanup } from 'solid-js';
import { t } from '../../i18n';
import './Confirm.css';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) => {
    // Handle key events when dialog is open
    createEffect(() => {
        if (isOpen) {
            const handleKeys = (e: KeyboardEvent) => {
                if (e.key === ' ' || e.key === 'Enter') {
                    onConfirm();
                } else if (e.key === 'Escape') {
                    onCancel();
                }
            };

            window.addEventListener('keyup', handleKeys);
            onCleanup(() => window.removeEventListener('keyup', handleKeys));
        }
    });

    if (!isOpen) {
        return null;
    }

    return (
        <div class="confirm-dialog-overlay">
            <div class="confirm-dialog">
                <p>{message}</p>
                <footer>
                    <button class="cancel-button" onClick={onCancel}>{t('no')}</button>
                    <button class="next-button" onClick={onConfirm}>{t('yes')}</button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmDialog;
