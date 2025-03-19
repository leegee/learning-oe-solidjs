import { useTranslation } from "react-i18next";
import './Confirm.css';
import { useEffect } from "react";

interface ConfirmDialogProps {
    isOpen: boolean;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
}

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }: ConfirmDialogProps) => {
    const { t } = useTranslation(); // ✅ Hook is always called

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === ' ' || e.key === 'Enter') {
                onConfirm();
            }
            else if (e.key === 'Escape') {
                onCancel();
            }
        };

        window.addEventListener('keyup', handleKeys);
        return () => window.removeEventListener('keyup', handleKeys);
    }, [onConfirm, onCancel]); // ✅ Hook is always called, added dependency array

    if (!isOpen) {
        return null; // Now safe because hooks have already been called
    }

    return (
        <div className="confirm-dialog-overlay">
            <div className="confirm-dialog">
                <p>{message}</p>
                <footer>
                    <button className="cancel-button" onClick={onCancel}>{t('no')}</button>
                    <button className="next-button" onClick={onConfirm}>{t('yes')}</button>
                </footer>
            </div>
        </div>
    );
};

export default ConfirmDialog;
