import {
    createSignal,
    createEffect,
    createContext,
    type JSX,
    useContext,
    children,
    Show,
} from "solid-js";
import i18n from "i18next";
import { type Config } from "../lib/config";

const I18nContext = createContext<{
    t: (key: string) => string;
    language: () => string;
    setLanguage: (lng: string) => void;
}>({
    t: (key) => key,
    language: () => "en",
    setLanguage: () => { },
});

interface II18nProviderProps {
    config: Config;
    children: JSX.Element;
}

export const I18nProvider = (props: II18nProviderProps) => {
    const [language, setLanguage] = createSignal(i18n.language);
    const [ready, setReady] = createSignal(false);
    const resolvedChildren = children(() => props.children); // 👈 this is key

    createEffect(() => {
        (async () => {
            console.log("i18nProvider loading config");

            const resources = Object.fromEntries(
                Object.entries(props.config.i18n.availableLanguages).map(
                    ([lang, translations]) => [lang, { translation: translations }]
                )
            );

            await i18n.init({
                resources,
                lng: props.config.uiLanguage || props.config.targetLanguage || props.config.defaultLanguage,
                fallbackLng: props.config.defaultLanguage,
                interpolation: { escapeValue: false },
            });

            setLanguage(i18n.language);

            i18n.on("languageChanged", (lng) => {
                setLanguage(lng);
                console.debug("i18nProvider set language");
            });

            setReady(true);
            console.log("i18nProvider done i18n.init");
        })();
    });

    const t = i18n.t;

    return (
        <I18nContext.Provider value={{ t, language, setLanguage }}>
            <Show when={ready()} fallback={<div>Loading i18n...</div>}>
                {resolvedChildren()}
            </Show>
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    console.log("i18nProvider used");
    return context;
};
