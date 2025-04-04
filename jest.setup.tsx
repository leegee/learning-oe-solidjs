import "@testing-library/jest-dom";

import { type Config } from "./src/config";
import { type TFunction } from "i18next";
import { type JSX } from 'solid-js';
import { render } from 'solid-testing-library';
import { ConfigProvider } from './src/contexts/Config';
import { ConfirmProvider } from "./src/contexts/Confirm";

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

export const MockT: TFunction = ((key: string) => key) as TFunction;

interface RenderTestElement {
    children?: JSX.Element;
    <T extends object>(Component: (props: T & JSX.IntrinsicAttributes) => JSX.Element, props: T, mockConfig?: typeof MockConfig): void;
}

export const renderTestElement: RenderTestElement = function <T extends object>(
    Component: (props: T & JSX.IntrinsicAttributes) => JSX.Element,
    props: T,
    mockConfig: Config = MockConfig
) {
    render(() => (
        <ConfigProvider config={mockConfig}>
            <ConfirmProvider t={MockT}>
                <Component {...props} />
            </ConfirmProvider>
        </ConfigProvider>
    ));
};
