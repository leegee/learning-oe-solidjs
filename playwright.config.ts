import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    timeout: 5_000,
    expect: {
        timeout: 5_000,
    },
});
