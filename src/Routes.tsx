// src/Routes.tsx
import { type JSX } from "solid-js";
import { Route } from "@solidjs/router";
import CourseScreen from "./views/course/CourseScreen";
import CourseFinishedScreen from "./views/course/CourseFinishedScreen";
import CourseHomeScreen from "./views/course/CourseHomeScreen";
import CourseEditor from "./components/CourseEditor";
import CardEditorScreen from "./views/card/CardEditorScreen";
import LessonCompletedScreen from "./views/course/lesson/LessonCompletedScreen";
import LessonInProgressScreen from "./views/course/lesson/LessonInProgressScreen";
import LessonIntroScreen from "./views/course/lesson/LessonIntroScreen";
import MenuScreen from "./views/menu/MenuScreen";

export const Routes = (): JSX.Element => (
    <>
        <Route path="/editor/:courseIdx/:lessonIdx/:cardIdx" component={CardEditorScreen} />
        <Route path="/editor/:courseIdx?" component={CourseEditor} />

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
        <Route path="*" component={() => <h1>The specified resource is unavailable.</h1>} />
    </>
);
