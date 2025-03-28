describe('Config file tests', () => {
    // This will run before each test case
    beforeEach(() => {
        jest.resetModules(); // Reset modules to ensure proper mock application
    });

    it('should correctly merge the config files', async () => {
        // Mock the config files dynamically inside the test to ensure they're applied correctly
        jest.mock('./default.config.json', () => ({
            defaultLanguage: 'en',
            targetLanguage: 'en',
            target: { apptitle: 'My App' },
            default: { apptitle: 'My App' },
            i18n: {
                detectUserLanguage: true,
                defaultLanguage: 'en',
                fallbackLanguage: 'en',
                availableLanguages: {},
            },
            animationShakeMs: 300,
        }));

        jest.mock('../app.config.json', () => ({
            targetLanguage: 'fr',
            defaultLanguage: 'fr',
            target: { apptitle: 'Mon Appli' },
            default: { apptitle: 'Mon Appli' },
            i18n: {
                detectUserLanguage: true,
                defaultLanguage: 'fr',
                fallbackLanguage: 'en',
                availableLanguages: {},
            },
            animationShakeMs: 200,
        }));

        const appConfig = (await import('./config')).default;

        expect(appConfig.targetLanguage).toBe('fr');
        expect(appConfig.defaultLanguage).toBe('fr');
        expect(appConfig.i18n.defaultLanguage).toBe('fr');
        expect(appConfig.target.apptitle).toBe('Mon Appli');
        expect(appConfig.animationShakeMs).toBe(200);
    });

    it('should throw an error if config files are not loaded correctly', async () => {
        jest.doMock('./default.config.json', () => undefined, { virtual: true });
        jest.doMock('../app.config.json', () => undefined, { virtual: true });

        await expect(import('./config')).rejects.toThrow('Config files are not properly loaded');
    });

    it('should throw an error if any required keys are missing from the merged config', async () => {
        jest.doMock('../app.config.json', () => ({
            targetLanguage: 'fr',
            defaultLanguage: 'fr',
            target: { apptitle: 'Mon Appli' },
        }), { virtual: true });

        await expect(import('./config')).rejects.toThrow('Config files are not properly loaded');
    });

    it('should throw an error if required keys are missing from the default config', async () => {
        jest.doMock('./default.config.json', () => ({
            targetLanguage: 'en',
        }), { virtual: true });

        await expect(import('./config')).rejects.toThrow('Invalid configuration file JSON.');
    });
});
