import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import appConfig from "../app.config.json";

type TranslationData = Record<string, string>;

const loadLocales = () => {
    const resources: Record<string, { translation: TranslationData }> = {};

    const defaultLang = appConfig.defaultLanguage as keyof typeof appConfig.i18n.availableLanguages;
    const targetLang = appConfig.targetLanguage as keyof typeof appConfig.i18n.availableLanguages;
    const uiLang = appConfig.uiLanguage as keyof typeof appConfig.i18n.availableLanguages;

    if (defaultLang && defaultLang in appConfig.i18n.availableLanguages) {
        resources[defaultLang] = { translation: appConfig.i18n.availableLanguages[defaultLang] };
    } else {
        console.warn(`No data found for default language: ${defaultLang}`);
    }

    if (targetLang && targetLang in appConfig.i18n.availableLanguages) {
        resources[targetLang] = { translation: appConfig.i18n.availableLanguages[targetLang] };
    } else {
        console.warn(`No data found for target language: ${targetLang}`);
    }

    if (uiLang && uiLang in appConfig.i18n.availableLanguages) {
        resources[uiLang] = { translation: appConfig.i18n.availableLanguages[uiLang] };
    } else {
        console.warn(`No data found for ui language: ${uiLang}`);
    }

    return { resources, defaultLang, targetLang, uiLang };
};

const { resources, defaultLang, targetLang, uiLang } = loadLocales();

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: uiLang || targetLang || defaultLang,
        fallbackLng: uiLang || defaultLang,
        interpolation: { escapeValue: false },
    });

export default i18n;
