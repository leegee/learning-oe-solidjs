import './global-css/index.css';
import { createRoot } from 'solid-js';
import { render } from "solid-js/web";
import { type Config, loadConfig } from './lib/config';
import App from "./App";
import { setupI18n } from './contexts/I18nProvider';
import { useCourseStore } from './global-state/course';

const initializeAppConfig = async (): Promise<Config | null> => {
  try {
    return await loadConfig();
  } catch (error) {
    console.error("Error loading configuration:", error);
    return null;
  }
};

const startApp = async () => {
  const appConfig = await initializeAppConfig();
  if (!appConfig) {
    throw new Error("Failed to load config. App will not start.");
  }

  await Promise.allSettled([
    useCourseStore(),
    setupI18n(appConfig),
  ]);

  const jsx = <App config={appConfig as Config} />;

  const root = document.getElementById("root");

  if (root) {
    root.innerHTML = '';
    render(() => jsx, root);
  } else {
    createRoot(() => jsx);
  }
};

await startApp(); 