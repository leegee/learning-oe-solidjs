import i18n from "i18next";
import { loadConfig } from "./config";

const appConfig = await loadConfig();

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

export const t = i18n.t; 
