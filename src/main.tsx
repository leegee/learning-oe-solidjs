import { render } from "solid-js/web";
import App from "./App";
import "./i18n";
import "./global-css/index.css";

const root = document.getElementById("root");

if (root) {
  render(() => <App />, root);
}
