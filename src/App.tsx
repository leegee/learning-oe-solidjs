import './App.css';
import { type JSX } from "solid-js";
import { Router } from "@solidjs/router";

import { ConfigProvider } from "./contexts/ConfigProvider";
import { ConfirmProvider } from "./contexts/ConfirmProvider";
import { I18nProvider } from "./contexts/I18nProvider";
import { type Config } from "./lib/config";
import { Routes } from './Routes';
import { useAppPath } from "./lib/use-app-path";
import HeaderComponent from "./components/Header";

export interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const baseRoute = useAppPath();

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const AppLayout = (layoutProps: ILayoutProps) => (
    <I18nProvider>
      <ConfigProvider config={props.config}>
        <ConfirmProvider>
          <main id="main">
            <HeaderComponent />
            {layoutProps.children}
          </main>
        </ConfirmProvider>
      </ConfigProvider>
    </I18nProvider>
  );

  return (
    <Router base={baseRoute} root={AppLayout} >
      <Routes />
    </Router >
  );
};

export default App;
