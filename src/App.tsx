// Note: using hash router because for ease of hosting on GitHub pages
import './App.css';
import { type JSX } from "solid-js";
import { HashRouter } from "@solidjs/router";

import { type Config } from "./lib/config";
import { Routes } from './Routes';
import { ConfigProvider } from "./contexts/ConfigProvider";
import { ConfirmProvider } from "./contexts/ConfirmProvider";
import { I18nProvider } from "./contexts/I18nProvider";
import HeaderComponent from "./components/Header";
import LoadCourseByRoute from './components/LoadCourseByRoute';

export interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const AppLayout = (layoutProps: ILayoutProps) => (
    <ConfigProvider config={props.config}>
      <LoadCourseByRoute />
      <I18nProvider>
        <ConfirmProvider>
          <main id="main">
            <HeaderComponent />
            {layoutProps.children}
          </main>
        </ConfirmProvider>
      </I18nProvider>
    </ConfigProvider>
  );

  return (
    <HashRouter root={AppLayout}>
      <Routes />
    </HashRouter >
  );
};

export default App;
