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

import { useEffect, useRef, useState } from 'react';

const InstallPWA = () => {
    const [isInstallPromptAvailable, setInstallPromptAvailable] = useState(false);
    const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null); // Use ref instead of let

    useEffect(() => {
        const handleBeforeInstallPrompt = (event: BeforeInstallPromptEvent) => {
            event.preventDefault();
            deferredPrompt.current = event; // Store event in useRef
            setInstallPromptAvailable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt.current) {
            await deferredPrompt.current.prompt();
            const choice = await deferredPrompt.current.userChoice;
            console.log("User choice:", choice.outcome);

            if (choice.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }

            deferredPrompt.current = null;
            setInstallPromptAvailable(false);
        }
    };

    return (
        isInstallPromptAvailable && (
            <button id="install-btn" onClick={handleInstallClick}>
                Install
            </button>
        )
    );
};

export default InstallPWA;
