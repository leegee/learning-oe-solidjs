import { type JSX } from "solid-js";
import { Navigate, Route } from "@solidjs/router";

import CourseRootScreen from "./views/course/CourseRootScreen";
import CompletedAllLessons from "./views/course/lesson/CompletedAllLessons";
import CourseHomeScreen from "./views/course/CourseHomeScreen";
import CardEditorScreen from "./views/card/CardEditorScreen";
import LessonCompletedScreen from "./views/course/lesson/LessonCompletedScreen";
import LessonInProgressScreen from "./views/course/lesson/LessonInProgressScreen";
import LessonIntroScreen from "./views/course/lesson/LessonIntroScreen";
import MenuScreen from "./views/menu/MenuScreen";

import CourseEditor from "./components/CourseEditor";

export const Routes = (): JSX.Element => (
    <>
        <Route path="/editor/:courseIdx/:lessonIdx/:cardIdx" component={CardEditorScreen} />
        <Route path="/editor/:courseIdx?" component={CourseEditor} />

        <Route path="/course/:courseIdx" component={CourseRootScreen}>
            <Route path="/" component={CourseHomeScreen} />
            <Route path=":lessonIdx" component={LessonIntroScreen} />
            <Route path=":lessonIdx/intro" component={LessonIntroScreen} />
            <Route path=":lessonIdx/in-progress" component={LessonInProgressScreen} />
            <Route path=":lessonIdx/completed" component={LessonCompletedScreen} />
            <Route path="finished" component={CompletedAllLessons} />
        </Route>

        <Route path="/editor" component={() => <Navigate href="/menu" />} />
        <Route path="/course" component={() => <Navigate href="/menu" />} />
        <Route path="/menu" component={MenuScreen} />
        <Route path="/" component={() => <Navigate href="/menu" />} />
        <Route path="*" component={() => <h1>The specified resource is unavailable.</h1>} />
    </>
);
