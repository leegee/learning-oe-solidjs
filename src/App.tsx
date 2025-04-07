import { createSignal, createMemo, createEffect } from "solid-js";

import * as state from "./global-state/lessons";
import { ConfigProvider } from "./contexts/Config";
import { ConfirmProvider } from "./contexts/Confirm";
import { courseStore, lessonTitles2Indicies } from "./global-state/course";
import { type Config } from "./config";
import LessonList from "./components/LessonList";
import Header from "./components/Header";
import HomeScreen from "./components/Home";
import LessonIntro from "./components/LessonIntro";
import LessonComponent from "./components/Lesson";
import LessonCompleted from "./components/LessonCompleted";
import CompletedAllLessons from "./components/CompletedAllLessons";
import Stats from "./components/Stats";
import { t } from "./i18n";

import "./App.css";

enum LessonState {
  Home,           // Viewing the home screen
  Intro,          // Lesson intro screen before questions start
  InProgress,     // Actively answering lesson questions
  Completed,      // Lesson completed summary screen
  CourseFinished, // All lessons are completed
}

interface IAppProps {
  config: Config;
}

const App = (props: IAppProps) => {
  const initialLessonIndex = state.getCurrentLessonIndex();

  const [currentLessonIndex, setCurrentLessonIndex] = createSignal(initialLessonIndex);
  const [lessonTime, setLessonTime] = createSignal<number>(0);
  const [lessonState, setLessonState] = createSignal(LessonState.Home);
  const currentLesson = createMemo(() => courseStore.lessons[currentLessonIndex()]);

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
    if (currentLessonIndex() < courseStore.lessons.length - 1) {
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
    if (!courseStore.loading) {
      const isCourseFinished = initialLessonIndex >= courseStore.lessons.length;
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
              courseMetadata={courseStore.courseMetadata!}
              currentLessonIndex={currentLessonIndex()}
              lessons={lessonTitles2Indicies()}
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
          <CompletedAllLessons totalLessons={courseStore.lessons.length}>
            {/* <Stats /> */}
          </CompletedAllLessons>
        );

      default:
        return <div>Error: Unknown lesson state</div>;
    }
  };

  return (
    <ConfigProvider config={props.config}>
      <ConfirmProvider t={t}>
        <main
          id="main"
          class={[lessonState() === LessonState.InProgress ? "lesson-active" : "", lessonState() === LessonState.Home ? "home-active" : ""]
            .filter(Boolean)
            .join(" ")}
        >
          <Header
            courseMetadata={courseStore.courseMetadata!}
            isLessonActive={lessonState() === LessonState.InProgress}
          />

          {!courseStore.loading && renderContent()}
        </main>
      </ConfirmProvider>
    </ConfigProvider>
  );
};

export default App;
