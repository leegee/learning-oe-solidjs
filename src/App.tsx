import { createSignal, createMemo } from "solid-js";

import LessonList from "./components/LessonList";
import * as state from "./Lessons/state";
import { lessons, lessonTitles2Indicies } from "./Lessons";
import Header from "./components/Header";
import HomeScreen from "./components/Home";
import LessonIntro from "./components/LessonIntro";
import LessonComponent from "./components/Lesson";
import LessonCompleted from "./components/LessonCompleted";
import CompletedAllLessons from "./components/CompletedAllLessons";
import Stats from "./components/Stats";
import AboutComponent from "./components/About";

import "./App.css";

enum LessonState {
  Home,           // Viewing the home screen
  Intro,          // Lesson intro screen before questions start
  InProgress,     // Actively answering lesson questions
  Completed,      // Lesson completed summary screen
  CourseFinished, // All lessons are completed
}

const App = () => {
  const initialLessonIndex = state.loadCurrentLessonIndex();

  const [currentLessonIndex, setCurrentLessonIndex] = createSignal(initialLessonIndex);
  const [lessonTime, setLessonTime] = createSignal<number>(0);
  const [lessonState, setLessonState] = createSignal(
    initialLessonIndex >= lessons.length ? LessonState.CourseFinished : LessonState.Home
  );

  const currentLesson = createMemo(() => lessons[currentLessonIndex()]);

  const startLesson = (lessonIndex: number) => {
    setCurrentLessonIndex(lessonIndex);
    state.saveCurrentLessonIndex(lessonIndex);
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
    if (currentLessonIndex() < lessons.length - 1) {
      startLesson(currentLessonIndex() + 1);
      goHome();
    } else {
      setLessonState(LessonState.CourseFinished);
    }
  };

  const goHome = () => setLessonState(LessonState.Home);

  const onQuestionAnswered = () => state.addQuestionCompleted();

  const onCorrectAnswer = () => {
    state.addCorrectAnswer();
  };

  const onIncorrectAnswer = (incorrectAnswer: string) => {
    const updatedAnswers = [...(state.loadIncorrectAnswers(currentLessonIndex()) ?? []), incorrectAnswer];
    state.saveIncorrectAnswers(currentLessonIndex(), updatedAnswers);
  };

  const renderContent = () => {
    switch (lessonState()) {
      case LessonState.Home:
        return (
          <HomeScreen>
            <Stats />
            <LessonList
              currentLessonIndex={currentLessonIndex()}
              lessons={lessonTitles2Indicies()}
              onLessonSelected={startLesson}
            />
            <AboutComponent />
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
            onQuestionAnswered={onQuestionAnswered}
            onCorrectAnswer={onCorrectAnswer}
            onIncorrectAnswer={onIncorrectAnswer}
            onLessonComplete={completeLesson}
          />
        );

      case LessonState.Completed:
        return (
          <LessonCompleted
            onLessonComplete={lessonComplete}
            questionCount={currentLesson().cards.length}
            durationInSeconds={lessonTime() ?? -1}
            mistakeCount={state.loadIncorrectAnswers(currentLessonIndex()).length}
          />
        );

      case LessonState.CourseFinished:
        return (
          <CompletedAllLessons totalLessons={lessons.length}>
            <Stats />
            <LessonList
              currentLessonIndex={currentLessonIndex()}
              lessons={lessonTitles2Indicies()}
              onLessonSelected={startLesson}
            />
          </CompletedAllLessons>
        );

      default:
        return <div>Error: Unknown lesson state</div>;
    }
  };

  return (
    <main
      id="main"
      class={[lessonState() === LessonState.InProgress ? "lesson-active" : "", lessonState() === LessonState.Home ? "home-active" : ""]
        .filter(Boolean)
        .join(" ")}
    >
      <Header
        isLessonActive={lessonState() === LessonState.InProgress}
        currentLessonIndex={currentLessonIndex()}
        totalLessons={lessons.length}
      />

      {renderContent()}
    </main>
  );
};

export default App;
