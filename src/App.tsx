import { createSignal, createEffect, createMemo } from "solid-js";
import { t } from './i18n';

import config from "./config";
import LessonList from "./components/LessonList";
import * as state from "./Lessons/state";
import { lessons, lessonTitles2Indicies } from "./Lessons";
import HomeScreen from "./components/Home";
import LessonIntro from "./components/LessonIntro";
import LessonComponent from "./components/Lesson";
import LessonCompleted from "./components/LessonCompleted";
import CompletedAllLessons from "./components/CompletedAllLessons";
import Stats from "./components/Stats";
import AboutComponent from "./components/About";

import "./App.css";

const App = () => {
  const initialLessonIndex = state.loadCurrentLesson();

  const [correctAnswers, setCorrectAnswers] = createSignal(state.loadCorrectAnswers());
  const [currentLessonIndex, setCurrentLessonIndex] = createSignal(initialLessonIndex);
  const [isCourseFinished, setIsCourseCompleted] = createSignal(initialLessonIndex >= lessons.length);
  const [isLessonActive, setIsLessonActive] = createSignal(false);
  const [isLessonCompleted, setIsLessonCompleted] = createSignal(false);
  const [isLessonIntro, setIsShowLessonIntro] = createSignal(true);
  const [isShowHome, setIsShowHome] = createSignal(true);
  const [lessonDurationSeconds, setLessonDurationSeconds] = createSignal<number | null>(null);
  const [lessonStartTime, setLessonStartTime] = createSignal<number | null>(null);
  const [totalIncorrectAnswers, setTotalIncorrectAnswers] = createSignal(state.countTotalIncorrectAnswers());

  const totalQuestionsAnswered = state.loadQuestionsAnswered();
  const currentLesson = createMemo(() => lessons[currentLessonIndex()]);

  createEffect(() => {
    console.log("currentLessonIndex changed:", currentLessonIndex());
  });

  // When the current lesson index changes, a new lesson is introduced
  createEffect(() => {
    setTotalIncorrectAnswers(state.countTotalIncorrectAnswers());
    setIsCourseCompleted(currentLessonIndex() >= lessons.length);
    setIsShowLessonIntro(true);
    setIsLessonCompleted(false);
    console.log('App Effect: lessonIndex ', currentLessonIndex());
  });

  createEffect(() => {
    setIsLessonActive(!isLessonIntro() && !isLessonCompleted() && !isCourseFinished());
  });

  const onQuestionAnswered = () => {
    state.addQuestionCompleted();
  }

  const onCorrectAnswer = (numberOfCorrectAnswers = 1) => {
    const totalCorrect = state.addCorrectAnswers(numberOfCorrectAnswers);
    setCorrectAnswers(totalCorrect);
  }

  const onIncorrectAnswer = (incorrectAnswer: string) => {
    const existingAnswers = state.loadIncorrectAnswers(currentLessonIndex()) ?? [];
    const updatedAnswers = [...existingAnswers, incorrectAnswer];
    state.saveIncorrectAnswers(currentLessonIndex(), updatedAnswers);
    setTotalIncorrectAnswers(prev => prev + 1);
  };

  const onLessonStart = () => {
    console.log('App onLessonStart', currentLessonIndex());
    state.resetLesson(currentLessonIndex());
    setLessonStartTime(Date.now());
    setIsShowLessonIntro(false);
  }

  const onContinue = () => {
    console.log('App onContinue');
    if (currentLessonIndex() < lessons.length - 1) {
      const nextLessonIndex = currentLessonIndex() + 1;
      setCurrentLessonIndex(nextLessonIndex);
      state.saveCurrentLesson(nextLessonIndex);
      setIsShowHome(true);
      console.log('App onContinue increments lessonIndex');
    } else {
      setIsCourseCompleted(true);
    }
  };

  const onLessonSelected = (lessonIndex: number) => {
    console.log('App onLessonSelected lessonIndex', lessonIndex);
    setIsShowHome(false);
    setCurrentLessonIndex(lessonIndex);
  }

  const onLessonCancelled = () => {
    setIsLessonActive(false);
    setLessonStartTime(null);
    setIsLessonCompleted(false);
    setIsShowHome(true);
  }

  const onLessonComplete = () => {
    setIsLessonCompleted(true);
    if (lessonStartTime() !== null) {
      setLessonDurationSeconds(Math.floor((Date.now() - lessonStartTime()!) / 1000));
      setLessonStartTime(null);
    }
  }

  const renderHeader = () => {
    if (isLessonActive()) {
      return '';
    }
    return (
      <header>
        <div class="header-progress">
          <progress
            class="course-progress"
            value={currentLessonIndex()}
            max={lessons.length}
            aria-label={t('course_progress')}
            title={`${t('all_lessons')} ${currentLessonIndex() + 1} / ${lessons.length}`}
          />
        </div>

        <div class='header-text'>
          <h1 lang={config.targetLanguage}>{config.target.apptitle}</h1>
          <h2 lang={config.defaultLanguage}>{config.default.apptitle}</h2>
        </div>
      </header>
    );
  }

  const renderConditional = () => {
    if (isShowHome()) {
      return (
        <HomeScreen>
          <Stats
            incorrectAnswers={totalIncorrectAnswers()}
            questionsAnswered={totalQuestionsAnswered}
            correctAnswers={correctAnswers()}
          />
          <LessonList
            currentLessonIndex={currentLessonIndex()}
            lessons={lessonTitles2Indicies()}
            onLessonSelected={onLessonSelected}
          />
          <AboutComponent />
        </HomeScreen>
      )
    }

    if (isLessonIntro()) {
      return (
        <LessonIntro
          title={currentLesson().title}
          description={currentLesson().description}
          index={currentLessonIndex()}
          onContinue={onLessonStart}
        />
      )
    }

    if (isLessonCompleted()) {
      return (
        <LessonCompleted
          onContinue={onContinue}
          questionCount={currentLesson().cards.length}
          durationInSeconds={lessonDurationSeconds() !== null ? lessonDurationSeconds()! : -1}
          mistakeCount={state.loadIncorrectAnswers(currentLessonIndex()).length}
        />
      )
    }

    if (isCourseFinished()) {
      return (
        <CompletedAllLessons
          totalLessons={lessons.length}
        >
          <Stats
            incorrectAnswers={totalIncorrectAnswers()}
            questionsAnswered={totalQuestionsAnswered}
            correctAnswers={correctAnswers()}
          />
          <LessonList
            currentLessonIndex={currentLessonIndex()}
            lessons={lessonTitles2Indicies()}
            onLessonSelected={onLessonSelected}
          />
        </CompletedAllLessons>
      )
    };

    return (
      <LessonComponent
        lesson={currentLesson()}
        onCancel={onLessonCancelled}
        onQuestionAnswered={onQuestionAnswered}
        onCorrectAnswer={onCorrectAnswer}
        onIncorrectAnswer={onIncorrectAnswer}
        onLessonComplete={onLessonComplete}
      />
    );
  };

  return (
    <main
      id='main'
      class={[
        isLessonActive() ? "lesson-active" : "",
        isShowHome() ? "home-active" : "",
      ].filter(Boolean).join(' ')}
    >
      {renderHeader()}
      {renderConditional()}
    </main>
  );
};

export default App;
