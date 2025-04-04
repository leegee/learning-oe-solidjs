import { createRoot } from 'solid-js';
import { render } from "solid-js/web";

import App from "./App";
import { type Config, loadConfig } from './config';
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
      root.innerHTML = '';
      render(() => <App config={appConfig as Config} />, root);
    } else {
      createRoot(() => (<App config={appConfig as Config} />));
    }

  } else {
    console.error("Failed to load config. App will not start.");
  }
};

startApp(); 