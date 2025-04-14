import "./global-css/index.css";
import { createRoot } from 'solid-js';
import { render } from "solid-js/web";
import { type Config, loadConfig } from './lib/config';
import App from "./App";

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
  if (!appConfig) {
    throw new Error("Failed to load config. App will not start.");
  }

  const root = document.getElementById("root");

  const jsx = <App config={appConfig as Config} />;

  if (root) {
    root.innerHTML = '';
    render(() => jsx, root);
  } else {
    createRoot(() => jsx);
  }

};

startApp(); 