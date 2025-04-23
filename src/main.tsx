import './global-css/index.css';
import { createRoot, createSignal, createEffect } from 'solid-js';
import { render } from "solid-js/web";
import { type Config, loadConfig } from './lib/config';
import App from "./App";
import { setupI18n } from './contexts/I18nProvider';
import { useCourseStore } from './global-state/course';
import { useLessonStore } from './global-state/lessons';

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

  // Create a signal to track the course index
  const [courseIdx, setCourseIdx] = createSignal(Number(window.location.pathname.split('/')[2]));

  // Effect to update courseIdx when the URL path changes
  createEffect(() => {
    const currentCourseIdx = Number(window.location.pathname.split(/\/+/)[3]);
    setCourseIdx(isNaN(currentCourseIdx) ? 0 : currentCourseIdx);
  });

  const [courseResult, _] = await Promise.allSettled([
    useCourseStore(courseIdx),
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
