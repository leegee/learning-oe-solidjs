import './App.css';
import { JSX } from "solid-js";
import { Route, Router } from "@solidjs/router";

import { ConfigProvider } from "./contexts/Config";
import { ConfirmProvider } from "./contexts/Confirm";
import { I18nProvider } from "./contexts/I18nProvider";
import { type Config } from "./lib/config";
import { useAppPath } from "./lib/use-app-path";
import CourseScreen from "./routes/lessons/CourseScreen";
import CourseFinishedScreen from "./routes/lessons/CourseFinishedScreen";
import CourseHomeScreen from './routes/lessons/CourseHomeScreen';
import CourseEditor from "./components/CourseEditor";
import Editor from './routes/course-editor/EditorScreen';
import Header from "./components/Header";
import LessonCompletedScreen from "./routes/lessons/LessonCompletedScreen";
import LessonInProgressScreen from './routes/lessons/LessonInProgressScreen';
import LessonIntroScreen from './routes/lessons/LessonIntroScreen';
import MenuScreen from "./routes/menu/MenuScreen";

export interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const baseRoute = useAppPath();

  interface ILayoutProps {
    children?: JSX.Element;
  }

  const Layout = (layoutProps: ILayoutProps) => (
    <I18nProvider>
      <ConfigProvider config={props.config}>
        <ConfirmProvider>
          <main id="main">
            <Header />
            {layoutProps.children}
          </main>
        </ConfirmProvider>
      </ConfigProvider>
    </I18nProvider>
  );

  return (
    <Router base={baseRoute} root={Layout} >

      <Route path="/editor/:courseIdx/:lessonIdx/:cardIdx" component={() => <Editor />} />
      <Route path="/editor/:courseIdx?" component={() => <CourseEditor />} />

      <Route path="/course/:courseIdx" component={CourseScreen}>
        <Route path="/" component={CourseHomeScreen} />
        <Route path=":lessonIdx" component={LessonIntroScreen} />
        <Route path=":lessonIdx/intro" component={LessonIntroScreen} />
        <Route path=":lessonIdx/in-progress" component={LessonInProgressScreen} />
        <Route path=":lessonIdx/completed" component={LessonCompletedScreen} />
        <Route path="finished" component={CourseFinishedScreen} />
      </Route>

      <Route path="/menu" component={MenuScreen} />
      <Route path="/" component={MenuScreen} />
      <Route path="*" component={() => <h1>Unknown Route</h1>} />
    </Router >
  );
};

export default App;
