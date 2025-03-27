/** @type {import('jest').Config} */
export default {
    testEnvironment: "jsdom",
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest",
        "^.+\\.(css|less|sass|scss)$": "jest-transform-stub"
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
};

