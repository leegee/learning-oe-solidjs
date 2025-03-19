import i18n from "i18next";
import { createSignal, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import appConfig from "../app.config.json";

const { defaultLanguage, targetLanguage, uiLanguage, i18n: i18nConfig } = appConfig;

const resources = Object.fromEntries(
    Object.entries(i18nConfig.availableLanguages).map(([lang, translations]) => [
        lang,
        { translation: translations },
    ])
);

i18n.init({
    resources,
    lng: uiLanguage || targetLanguage || defaultLanguage,
    fallbackLng: defaultLanguage,
    interpolation: { escapeValue: false },
});

export const useTranslation = () => {
    const [t, setT] = createSignal(i18n.t);
    const [store, setStore] = createStore({ t: i18n.t });

    createEffect(() => {
        i18n.on("languageChanged", () => {
            setT(() => i18n.t);
            setStore("t", i18n.t);
        });
    });

    return [store.t, i18n.changeLanguage];
};
