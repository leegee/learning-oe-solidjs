import '@testing-library/jest-dom';
import "localstorage-memory";

global.window = globalThis as any;
global.document = globalThis.document || {};
global.localStorage = localStorage;