import { createSignal, createEffect } from 'solid-js';

// Define BeforeInstallPromptEvent interface
interface BeforeInstallPromptEvent extends Event {
    readonly platforms: string[];
    readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
    prompt(): Promise<void>;
}

// Extend WindowEventMap to include the event
declare global {
    interface WindowEventMap {
        beforeinstallprompt: BeforeInstallPromptEvent;
    }
}

const InstallPWA = () => {
    const [isInstallPromptAvailable, setInstallPromptAvailable] = createSignal(false);
    const [deferredPrompt, setDeferredPrompt] = createSignal<BeforeInstallPromptEvent | null>(null);

    createEffect(() => {
        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            setDeferredPrompt(event);
            setInstallPromptAvailable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    });

    const handleInstallClick = async () => {
        const promptEvent = deferredPrompt();
        if (promptEvent) {
            await promptEvent.prompt();
            const choice = await promptEvent.userChoice;
            console.debug("User choice:", choice.outcome);

            if (choice.outcome === 'accepted') {
                console.debug('User accepted the install prompt');
            } else {
                console.debug('User dismissed the install prompt');
            }

            setDeferredPrompt(null);
            setInstallPromptAvailable(false);
        }
    };

    return (
        isInstallPromptAvailable() && (
            <button id="install-btn" onClick={handleInstallClick}>
                Install
            </button>
        )
    );
};

export default InstallPWA;
