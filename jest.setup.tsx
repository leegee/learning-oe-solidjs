import "@testing-library/jest-dom";

const fs = require('fs');
const path = require('path');

import { type Config } from "./src/lib/config";
import { type TFunction } from "i18next";
import { type JSX } from 'solid-js';
import { render } from 'solid-testing-library';
import { ConfigProvider } from './src/contexts/ConfigProvider';
import { ConfirmProvider } from "./src/contexts/ConfirmProvider";
import { MockI18nProvider } from "./src/tests/MockI18nContext";
import i18n from "i18next";

const lessonFiles = [
    'test.json',
    'lessons.json',
    'uk-constitution.json',
];

export const MockT: typeof i18n.t = ((key: string, _options?: any) => {
    return key;
}) as TFunction;

interface ILessonMockData {
    [key: string]: () => Promise<{ default: any }>;
}
const mockedLessonsJson: ILessonMockData = {};

lessonFiles.forEach((filename) => {
    const filePath = path.join(__dirname, 'lessons', filename);
    const fileData = fs.readFileSync(filePath, 'utf-8');
    mockedLessonsJson[`../../lessons/${filename}`] = () => {
        // console.log('With mockedLessonsJson:', JSON.parse(fileData));
        return Promise.resolve({ default: JSON.parse(fileData) })
    };
});

// Mock: export const LESSONS_JSON = () => import.meta.glob("../../lessons/*.json");
jest.mock('./src/config/lesson-loader', () => {
    return {
        LESSONS_JSON: (...args: any[]) => {
            console.log('Using mocked JSON rv', mockedLessonsJson);
            console.log('Using args', args);
            return mockedLessonsJson
        },
    };
});


jest.mock('i18next', () => ({
    t: ((key: string) => key),
    use: () => ({ init: () => { } }),
    init: () => { },
    changeLanguage: () => Promise.resolve(),
    useI18n: () => ({ t: ((key: string) => key) }),
}));

jest.mock('solid-js', () => {
    const actual = jest.requireActual('solid-js');
    return {
        ...actual,
        createResource: (_source: any) => {
            const result = _source();
            return [() => result, { refetching: false, mutate: () => { } }];
        }
    };
});


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