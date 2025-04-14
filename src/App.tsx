import { JSX } from "solid-js";
import { Route, Router } from "@solidjs/router";
import packageJson from '../package.json';
import { ConfigProvider } from "./contexts/Config";
import { ConfirmProvider } from "./contexts/Confirm";
import { courseStore } from "./global-state/course";
import { t } from "./lib/i18n";
import CourseComponent from "./routes/Lessons/Course";
import Header from "./components/Header";
import { type Config } from "./lib/config";
import DashboardCourseOverview from "./routes/dashboard";
import MenuContent from "./components/Menu/MenuContent";
import './App.css';

interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const homepage = packageJson.homepage || "/";
  const baseRoute = homepage ? (new URL(homepage)).pathname.replace(/\/?$/, '/') : '/';

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const Layout = (layoutProps: ILayoutProps) => (
    <ConfigProvider config={props.config}>
      <ConfirmProvider t={t}>
        <main id="main">
          <Header
            courseMetadata={courseStore.store.courseMetadata!}
            hide={false}
          />
          {layoutProps.children}
        </main>
      </ConfirmProvider>
    </ConfigProvider>
  );

  return (
    <Router base={baseRoute} root={Layout}>
      <Route path="/dashboard" component={() => (
        <DashboardCourseOverview
          courseMetadata={courseStore.store.courseMetadata!}
          lessons={courseStore.store.lessons!}
        />
      )} />
      <Route path="/menu" component={() => <MenuContent />} />
      <Route path="*" component={CourseComponent} />
    </Router>

  );
};

export default App;
