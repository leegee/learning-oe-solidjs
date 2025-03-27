/** @type {import('jest').Config} */
export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};
