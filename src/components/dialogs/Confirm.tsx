import './Confirm.css';
import { createEffect, onCleanup } from 'solid-js';
import { useI18n } from '../../contexts/I18nProvider';

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
    const { t } = useI18n();

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
        <div class="modal-bg">
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
