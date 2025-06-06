/** @type {import('jest').Config} */
export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
        "^.+\\.(css|less|sass|scss)$": "jest-transform-stub",
        "^.+\\.json5$": "json5-jest"
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],

    testPathIgnorePatterns: ['/node_modules/', '/dist/', 'tests/'], // ie Playwright tests

    reporters: [
        'default',
        // ['jest-stare', {
        //     resultDir: 'test-results',
        //     reportTitle: 'Jest Test Report',
        //     darkMode: true,
        // }],
    ],
};
