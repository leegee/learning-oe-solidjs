import './App.css';
import { JSX } from "solid-js";
import { Route, Router } from "@solidjs/router";
import { ConfigProvider } from "./contexts/Config";
import { ConfirmProvider } from "./contexts/Confirm";
import { courseStore } from "./global-state/course";
import { I18nProvider } from "./contexts/I18nProvider";
import CourseComponent from "./routes/Lessons/Course";
import Header from "./components/Header";
import { type Config } from "./lib/config";
import DashboardCourseOverview from "./routes/dashboard";
import MenuContent from "./components/Menu/MenuContent";
import { useAppPath } from "./lib/use-app-path";

export interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const baseRoute = useAppPath();

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const Layout = (layoutProps: ILayoutProps) => (
    <I18nProvider config={props.config}>
      <ConfigProvider config={props.config}>
        <ConfirmProvider>
          <main id="main">
            <Header
              courseMetadata={courseStore.store.courseMetadata!}
              hide={false}
            />
            {layoutProps.children}
          </main>
        </ConfirmProvider>
      </ConfigProvider>
    </I18nProvider>
  );

  return (
    <Router base={baseRoute} root={Layout} >
      <Route path="/dashboard" component={() => (
        <DashboardCourseOverview />
      )} />
      <Route path="/lesson" component={() => <CourseComponent />} />
      <Route path="/menu" component={() => <MenuContent />} />
      <Route path="/" component={() => <CourseComponent />} />
      <Route path="*" component={() => <h1>Unknown Route</h1>} />
    </Router >
  );
};

export default App;

// export default () => {
//   return (
//     <Router>
//       <Route path="*" component={() => <div>Inside router</div>} />
//     </Router>
//   );
// };
