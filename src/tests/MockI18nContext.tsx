import { createContext, JSX } from "solid-js";
import { useContext } from "solid-js";
import { type TFunction } from "i18next";

export const MockT: TFunction = ((key: string) => key) as TFunction;

const MockI18nContext = createContext({
    t: MockT,
    language: () => "en",
    setLanguage: () => { },
});

export interface IMockI18nProviderProps {
    children: JSX.Element;
}

export const MockI18nProvider = (props: IMockI18nProviderProps) => (
    <MockI18nContext.Provider value={{
        t: MockT,
        language: () => "en",
        setLanguage: () => { }
    }}>
        {props.children}
    </MockI18nContext.Provider>
);

// replace your real useI18n during tests
export const useI18n = () => {
    const ctx = useContext(MockI18nContext);
    if (!ctx) {
        throw new Error("useI18n must be used within I18nProvider");
    }
    return ctx;
};
