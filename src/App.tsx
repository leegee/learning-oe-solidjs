import './App.css';
import { type JSX } from "solid-js";
import { Router } from "@solidjs/router";

import { type Config } from "./lib/config";
import { Routes } from './Routes';
import { ConfigProvider } from "./contexts/ConfigProvider";
import { ConfirmProvider } from "./contexts/ConfirmProvider";
import { I18nProvider } from "./contexts/I18nProvider";
import { useAppPath } from "./lib/use-app-path";
import HeaderComponent from "./components/Header";
import LoadCourseByRoute from './components/LoadCourseByRoute';

export interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const baseRoute = useAppPath();

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const AppLayout = (layoutProps: ILayoutProps) => (
    <>
      <LoadCourseByRoute />
      <ConfigProvider config={props.config}>
        <I18nProvider>
          <ConfirmProvider>
            <main id="main">
              <HeaderComponent />
              {layoutProps.children}
            </main>
          </ConfirmProvider>
        </I18nProvider>
      </ConfigProvider>
    </>
  );

  return (
    <Router base={baseRoute} root={AppLayout} >
      <Routes />
    </Router >
  );
};

export default App;
