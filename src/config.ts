import defaultConfig from './default.config.json';
import appConfigRaw from '../app.config.json';

interface AvailableLanguages {
    [language: string]: {
        [key: string]: string;
    };
}

interface I18n {
    detectUserLanguage: boolean;
    defaultLanguage: string;
    fallbackLanguage: string;
    availableLanguages: AvailableLanguages;
}

interface LessonConfig {
    title: string;
    fileBasename: string;
}

interface Config {
    lessons: LessonConfig[];
    defaultLanguage: string;
    targetLanguage: string;
    uiLanguage?: string;
    appTitle: string;
    i18n: I18n;
    animationShakeMs: number;
}

const deepMerge = <T>(target: T, source: T): T => {
    if (typeof target !== 'object' || typeof source !== 'object' || target === null || source === null) {
        return source;
    }

    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key] || typeof target[key] !== 'object') {
                target[key] = {} as typeof source[typeof key];
            }
            deepMerge(target[key] as typeof source[typeof key], source[key] as typeof source[typeof key]);
        } else {
            target[key] = source[key];
        }
    }

    return target;
};


if (!defaultConfig || !appConfigRaw) {
    throw new Error('Config files are not properly loaded');
}

const appConfig = deepMerge<Config>(defaultConfig, appConfigRaw);

const requiredKeys: (keyof Config)[] = ['targetLanguage', 'defaultLanguage', 'appTitle', 'i18n'];

let ok = true;
requiredKeys.forEach((key) => {
    if (!appConfig[key]) {
        console.warn(`app.config.json should contain the "${key}" key`);
        ok = false;
    }
});

if (!ok) {
    throw new TypeError('Invalid configuration file JSON.');
}

export default appConfig;
