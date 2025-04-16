import "@testing-library/jest-dom";

import { type Config } from "./src/lib/config";
import { type TFunction } from "i18next";
import { type JSX } from 'solid-js';
import { render } from 'solid-testing-library';
import { ConfigProvider } from './src/contexts/Config';
import { ConfirmProvider } from "./src/contexts/Confirm";
import { MockI18nProvider } from "./src/tests/MockI18nContext";

export const MockT: TFunction = ((key: string, _options?: any) => {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxx')
    return key;
}) as TFunction;

jest.mock('i18next', () => ({
    useI18n: () => ({ t: MockT }),
}));

export const MockConfig = {
    defaultLanguage: 'en',
    targetLanguage: 'ang',
    appTitle: 'App Title',
    lessons: [],
    animationShakeMs: 0,
    i18n: {
        detectUserLanguage: false,
        defaultLanguage: 'en',
        fallbackLanguage: 'en',
        availableLanguages: {
            "en": {}
        }
    },
};

export const renderTestElement = <T extends object>(
    Component: (props: T & JSX.IntrinsicAttributes) => JSX.Element,
    props: T,
    mockConfig: Config = MockConfig
): ReturnType<typeof render> => {
    return render(() => (
        <MockI18nProvider>
            <ConfigProvider config={mockConfig}>
                <ConfirmProvider>
                    <Component {...props} />
                </ConfirmProvider>
            </ConfigProvider>
        </MockI18nProvider>
    ));
};