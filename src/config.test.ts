describe('Config file tests', () => {
    beforeEach(() => {
        jest.resetModules(); // Reset modules to ensure proper mock application
    });

    it('should correctly merge the config files', async () => {
        jest.mock('./default.config.json', () => ({
            defaultLanguage: 'en',
            targetLanguage: 'en',
            appTitle: 'Mon Appli',
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
            appTitle: 'Mon Appli',
            i18n: {
                detectUserLanguage: true,
                defaultLanguage: 'fr',
                fallbackLanguage: 'en',
                availableLanguages: {},
            },
            animationShakeMs: 200,
        }));

        const { loadConfig } = await import('./config');
        const appConfig = await loadConfig();

        expect(appConfig.targetLanguage).toBe('fr');
        expect(appConfig.defaultLanguage).toBe('fr');
        expect(appConfig.i18n.defaultLanguage).toBe('fr');
        expect(appConfig.appTitle).toBe('Mon Appli');
        expect(appConfig.animationShakeMs).toBe(200);
    });

    describe('should gracefully handle config errors', () => {
        let logSpy: jest.SpyInstance<void, [message?: any, ...optionalParams: any[]]>;

        beforeEach(() => {
            jest.resetModules();
            jest.clearAllMocks();
            logSpy = jest.spyOn(console, "warn").mockImplementation(() => { });
        });

        afterEach(() => {
            logSpy.mockRestore();
        });

        it('should throw an error if the default config file failed to load', async () => {
            jest.doMock('./default.config.json', () => { throw new Error('Mocked load failure'); }, { virtual: true });
            const { loadConfig } = await import('./config');
            await expect(loadConfig()).rejects.toThrow('Default config file did not properly load');
            expect(logSpy).not.toHaveBeenCalled();
        });

        it('should throw an error if the custom config file failed to load', async () => {
            jest.doMock('../app.config.json', () => { throw new Error('Mocked load failure'); }, { virtual: true });
            jest.doMock('./default.config.json', () => ({
                defaultLanguage: 'en',
                targetLanguage: 'en',
                appTitle: 'Test App',
                i18n: {
                    detectUserLanguage: true,
                    defaultLanguage: 'en',
                    fallbackLanguage: 'en',
                    availableLanguages: {},
                },
                animationShakeMs: 300,
            }), { virtual: true });
            const { loadConfig } = await import('./config');
            await expect(loadConfig()).rejects.toThrow('Config file "app.config.json" did not properly load');
            expect(logSpy).not.toHaveBeenCalled();
        });

        it('should throw an error if any required keys are missing from the merged config', async () => {
            jest.doMock('./default.config.json', () => ({
                targetLanguage: 'en',
                defaultLanguage: 'en',
            }), { virtual: true });
            jest.doMock('../app.config.json', () => ({
                targetLanguage: 'iv',
                defaultLanguage: 'iv',
            }), { virtual: true });
            const { loadConfig } = await import('./config');
            await expect(loadConfig()).rejects.toThrow('Invalid configuration file JSON.');
            expect(logSpy).toHaveBeenCalled();
        });

    });
});
