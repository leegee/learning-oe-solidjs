import { type JSX } from "solid-js";
import { Navigate, Route } from "@solidjs/router";

import CardEditorScreen from "./views/card/CardEditorScreen";
import CompletedAllLessons from "./views/course/lesson/CompletedAllLessons";
import CourseEditor from "./components/CourseEditor";
import CourseHomeScreen from "./views/course/CourseHomeScreen";
import CourseRootScreen from "./views/course/CourseRootScreen";
import LessonCompletedScreen from "./views/course/lesson/LessonCompletedScreen";
import LessonInProgressScreen from "./views/course/lesson/LessonInProgressScreen";
import LessonIntroScreen from "./views/course/lesson/LessonIntroScreen";
import MenuScreen from "./views/menu/MenuScreen";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useConfigContext } from "./contexts/ConfigProvider";
import Homepage from "./views/Homepage";

export const Routes = (): JSX.Element => {
    return (
        <>
            <Route path="/home" component={Homepage} />

            {/* Course routes */}
            <Route path="/course" component={() => <Navigate href="/menu" />} />
            <Route path="/course/:courseIdx" component={CourseRootScreen}>
                <Route path="/" component={CourseHomeScreen} />
                <Route path=":lessonIdx" component={LessonIntroScreen} />
                <Route path=":lessonIdx/intro" component={LessonIntroScreen} />
                <Route path=":lessonIdx/in-progress" component={LessonInProgressScreen} />
                <Route path=":lessonIdx/completed" component={LessonCompletedScreen} />
                <Route path="finished" component={CompletedAllLessons} />
            </Route>

            {/* Editor routes */}
            <Route
                path="/editor/:courseIdx/:lessonIdx/:cardIdx"
                component={() => {
                    const { config } = useConfigContext();
                    return (
                        <ProtectedRoute allowed={config.allowCustomisation ?? false} redirect="/course/1">
                            <CardEditorScreen />
                        </ProtectedRoute>
                    );
                }}
            />
            <Route
                path="/editor/:courseIdx?"
                component={() => {
                    const { config } = useConfigContext();
                    return (
                        <ProtectedRoute allowed={config.allowCustomisation ?? false} redirect="/course/1">
                            <CourseEditor />
                        </ProtectedRoute>
                    );
                }}
            />

            {/* Menu route */}
            <Route
                path="/menu"
                component={() => {
                    const { config } = useConfigContext();
                    return (
                        <ProtectedRoute allowed={config.allowCustomisation ?? false} redirect="/course/1">
                            <MenuScreen />
                        </ProtectedRoute>
                    );
                }}
            />

            {/* Default route */}
            <Route
                path="/"
                component={() => {
                    const { config } = useConfigContext();
                    return (
                        <ProtectedRoute allowed={config.allowCustomisation ?? false} redirect="/course/1">
                            <Navigate href="/menu" />
                        </ProtectedRoute>
                    );
                }}
            />

            {/* Fallback route */}
            <Route
                path="*"
                component={() => {
                    const { config } = useConfigContext();
                    return (
                        <ProtectedRoute allowed={config.allowCustomisation ?? false} redirect="/course/1">
                            <Navigate href="/menu" />
                        </ProtectedRoute>
                    );
                }}
            />
        </>
    );
};
