import { createRoot } from 'solid-js';
import { render } from "solid-js/web";

import App from "./App";
import { loadConfig } from './config';
import "./i18n";
import "./global-css/index.css";

const initializeAppConfig = async () => {
  try {
    const config = await loadConfig();
    return config;
  } catch (error) {
    console.error("Error loading configuration:", error);
    return null;
  }
};

const startApp = async () => {
  const appConfig = await initializeAppConfig();

  if (appConfig) {
    const root = document.getElementById("root");

    if (root) {
      render(() => <App />, root);
    } else {
      createRoot(() => (<App />));
    }

  } else {
    console.error("Failed to load config. App will not start.");
  }
};

startApp(); 