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

interface CourseFileConfig {
    title: string;
    fileBasename: string;
}

export interface Config {
    allowCustomisation?: boolean;
    homeInsteadOfMenu: boolean;
    courses: CourseFileConfig[];
    defaultLanguage: string;
    targetLanguage: string;
    uiLanguage?: string;
    appTitle: string;
    menuTitle?: string;
    i18n: I18n;
    animationShakeMs: number;
}

const REQUIRED_KEYS: (keyof Config)[] = ['targetLanguage', 'defaultLanguage', 'appTitle', 'i18n'];

let configPromise: Promise<Config>;

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

// A singleton that can be used anywhere
// Since it is initially used by main.tsx, we can be assured the necesary files are loaded.
// In components, this is exposed via contexts/ConfigProvider set up in App.tsx
export const loadConfig = async (): Promise<Config> => {
    if (configPromise) {
        return configPromise;
    }

    configPromise = (async () => {
        let defaultConfig, appConfigRaw;
        try {
            defaultConfig = (await import('../default.config.json')).default;
        } catch (err) {
            throw new Error('Default config file did not properly load');
        }

        try {
            appConfigRaw = (await import('../../app.config.json')).default;
        } catch (err) {
            throw new Error('Config file "app.config.json" did not properly load');
        }

        const appConfig = deepMerge<Config>(defaultConfig, appConfigRaw);

        let ok = true;
        REQUIRED_KEYS.forEach((key) => {
            if (!appConfig[key]) {
                console.warn(`app.config.json should contain the "${key}" key`);
                ok = false;
            }
        });
        if (!ok) {
            throw new Error('Invalid configuration file JSON.');
        }

        // const resources = Object.fromEntries(
        //     Object.entries(appConfig.i18n.availableLanguages).map(([lang, translations]) => [
        //         lang,
        //         { translation: translations },
        //     ])
        // );

        // i18n.init({
        //     resources,
        //     lng: appConfig.uiLanguage || appConfig.targetLanguage || appConfig.defaultLanguage,
        //     fallbackLng: appConfig.defaultLanguage,
        //     interpolation: { escapeValue: false },
        // });

        return appConfig;
    })();

    return configPromise;
};

export const initializeAppConfig = async (): Promise<Config | null> => {
    try {
        return await loadConfig();
    } catch (error) {
        console.error("Error loading configuration:", error);
        return null;
    }
};