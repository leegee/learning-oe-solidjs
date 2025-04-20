import { children, createContext, createEffect, createSignal, type JSX, useContext, } from "solid-js";
import i18n from "i18next";
import { type Config } from "../lib/config";

export type Ii18nT = typeof i18n.t;

interface II18nProviderProps {
    children: JSX.Element;
}

const DefaultContext = {
    t: (...args: Parameters<typeof i18n.t>) => i18n.t(...args),
    language: () => i18n.language,
    setLanguage: (lng: string) => i18n.changeLanguage(lng),
};

const I18nContext = createContext<typeof DefaultContext>(DefaultContext);

export const setupI18n = async (config: Config) => {
    const resources = Object.fromEntries(
        Object.entries(config.i18n.availableLanguages).map(
            ([lang, translations]) => [lang, { translation: translations }]
        )
    );

    await i18n.init({
        resources,
        lng: config.uiLanguage || config.targetLanguage || config.defaultLanguage,
        fallbackLng: config.defaultLanguage,
        interpolation: { escapeValue: false },
    });
};


export const I18nProvider = (props: II18nProviderProps) => {
    const resolvedChildren = children(() => props.children);
    const [language, setLanguage] = createSignal(i18n.language);
    const [ready, setReady] = createSignal(false);
    // const t: typeof i18n.t = (...args: Parameters<typeof i18n.t>) => i18n.t(...args);
    const t = i18n.t;

    createEffect(() => {
        setLanguage(i18n.language);
        i18n.on("languageChanged", setLanguage);
        setReady(true);
    });

    if (!ready()) {
        return <div>Loading i18n...</div>;
    }

    return (
        <I18nContext.Provider value={{ t, language, setLanguage }}>
            {resolvedChildren()}
        </I18nContext.Provider>
    );
};

export const useI18n = () => {
    const context = useContext(I18nContext);
    if (!context) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return context;
};
