import { createSignal, createMemo, createEffect } from "solid-js";

import * as state from "../../global-state/lessons";
import { courseStore } from "../../global-state/course";
import LessonList from "./LessonList";
import Header from "../../components/Header";
import HomeScreen from "./Home";
import LessonIntro from "./LessonIntro";
import LessonComponent from "./Lesson";
import LessonCompleted from "./LessonCompleted";
import CompletedAllLessons from "./CompletedAllLessons";
import Stats from "./Stats";

import "./Course.css";

enum LessonState {
    Home,           // Viewing the home screen
    Intro,          // Lesson intro screen before questions start
    InProgress,     // Actively answering lesson questions
    Completed,      // Lesson completed summary screen
    CourseFinished, // All lessons are completed
}

const CourseComponent = () => {
    const initialLessonIndex = state.getCurrentLessonIndex();

    const [currentLessonIndex, setCurrentLessonIndex] = createSignal(initialLessonIndex);
    const [lessonTime, setLessonTime] = createSignal<number>(0);
    const [lessonState, setLessonState] = createSignal(LessonState.Home);
    const currentLesson = createMemo(() => courseStore.store.lessons[currentLessonIndex()]);

    const showLessonIntro = (lessonIndex: number) => {
        setCurrentLessonIndex(lessonIndex);
        state.setCurrentLessonIndex(lessonIndex);
        setLessonState(LessonState.Intro);
    };

    const beginQuestions = () => {
        state.resetLesson(currentLessonIndex());
        setLessonTime(Date.now());
        setLessonState(LessonState.InProgress);
    };

    const completeLesson = () => {
        setLessonState(LessonState.Completed);
        setLessonTime((prev) => Math.floor((Date.now() - prev) / 1000));
    };

    const lessonComplete = () => {
        if (currentLessonIndex() < courseStore.store.lessons.length - 1) {
            showLessonIntro(currentLessonIndex() + 1);
            goHome();
        } else {
            setLessonState(LessonState.CourseFinished);
        }
    };

    const goHome = () => setLessonState(LessonState.Home);

    const onAnswer = (cardIndex: number, incorrectAnswer?: string) => {
        // console.debug(`onAsnwer for ${currentLessonIndex()} / ${cardIndex} = ${incorrectAnswer || 'incorrect'}`);
        state.saveAnswer(currentLessonIndex(), cardIndex, incorrectAnswer || '');
    };

    // Watch for changes in the course
    createEffect(() => {
        if (!courseStore.store.loading) {
            const isCourseFinished = initialLessonIndex >= courseStore.store.lessons.length;
            setLessonState(isCourseFinished ? LessonState.CourseFinished : LessonState.Home);
        }
    });

    const renderContent = () => {
        switch (lessonState()) {
            case LessonState.Home:
                return (
                    <HomeScreen>
                        <Stats />
                        <LessonList
                            courseMetadata={courseStore.store.courseMetadata!}
                            currentLessonIndex={currentLessonIndex()}
                            lessons={courseStore.lessonTitles2Indicies()}
                            onLessonSelected={showLessonIntro}
                        />
                    </HomeScreen>
                );

            case LessonState.Intro:
                return (
                    <LessonIntro
                        title={currentLesson().title}
                        description={currentLesson().description}
                        index={currentLessonIndex()}
                        onLessonStart={beginQuestions}
                    />
                );

            case LessonState.InProgress:
                return (
                    <LessonComponent
                        lesson={currentLesson()}
                        onCancel={goHome}
                        onAnswer={onAnswer}
                        onLessonComplete={completeLesson}
                    />
                );

            case LessonState.Completed:
                return (
                    <LessonCompleted
                        onNext={lessonComplete}
                        durationInSeconds={lessonTime() ?? -1}
                    />
                );

            case LessonState.CourseFinished:
                return (
                    <CompletedAllLessons totalLessons={courseStore.store.lessons.length}>
                        {/* <Stats /> */}
                    </CompletedAllLessons>
                );

            default:
                return <div>Error: Unknown lesson state</div>;
        }
    };

    return (
        <article
            id="main"
            class={[lessonState() === LessonState.InProgress ? "lesson-active" : "", lessonState() === LessonState.Home ? "home-active" : ""]
                .filter(Boolean)
                .join(" ")}
        >
            {!courseStore.store.loading && renderContent()}
            {courseStore.store.loading && 'Loading...'}
        </article>
    );
}

export default CourseComponent;
