import './global-css/index.css';
import { createRoot } from 'solid-js';
import { render } from "solid-js/web";

import { type Config, loadConfig } from './lib/config';
import { setupI18n } from './contexts/I18nProvider';
import { useCourseStore } from './global-state/course';
import { useLessonStore } from './global-state/lessons';
import App from "./App";

// Initialize the app configuration
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

  const [courseResult, _] = await Promise.allSettled([
    useCourseStore(),
    setupI18n(appConfig),
  ]);

  if (courseResult.status === 'fulfilled') {
    useLessonStore(courseResult.value.getCourseIdx());
  } else {
    console.error('Failed to load course store:', courseResult.reason);
  }

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
