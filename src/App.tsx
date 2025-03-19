/*
  For reasons of future compatability, better or worse, this, 
  the  prototype's main component,  manages all navigation without 
  react-router or react-router-native or native-stack.

  For the same reason, access to state data is also managed here.
  
*/

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

  const [correctAnswers, setCorrectAnswers] = useState<number>(state.loadCorrectAnswers);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(initialLessonIndex);
  const [isCourseFinished, setIsCourseCompleted] = useState<boolean>(initialLessonIndex >= lessons.length);
  const [isLessonActive, setIsLessonActive] = useState(false);
  const [islessonCompleted, setIsLessonCompleted] = useState<boolean>(false);
  const [isLessonIntro, isShowLessonIntro] = useState<boolean>(true);
  const [isShowHome, setIsShowHome] = useState(true);
  const [lessonDurationSeconds, setLessonDurationSeconds] = useState<number | null>(null);
  const [lessonStartTime, setLessonStartTime] = useState<number | null>(null);
  const [totalIncorrectAnswers, setTotalIncorrectAnswers] = useState<number>(state.countTotalIncorrectAnswers());

  // const totalQuestions = lessons.reduce((sum, lesson) => sum + lesson.cards.length, 0);
  const totalQuestionsAnswered = state.loadQuestionsAnswered();
  const currentLesson = lessons[currentLessonIndex];

  // When the current lesson index changes, a new lesson is introduced
  useEffect(() => {
    setTotalIncorrectAnswers(state.countTotalIncorrectAnswers());
    setIsCourseCompleted(currentLessonIndex >= lessons.length);
    isShowLessonIntro(true);
    setIsLessonCompleted(false);
  }, [currentLessonIndex]);

  useEffect(() => {
    setIsLessonActive(!isLessonIntro && !islessonCompleted && !isCourseFinished);
  }, [currentLessonIndex, isLessonIntro, islessonCompleted, isCourseFinished]);

  const onQuestionAnswered = () => {
    state.addQuestionCompleted();
  }

  const onCorrectAnswer = (numberOfCorrectAnswers = 1) => {
    const totalCorect = state.addCorrectAnswers(numberOfCorrectAnswers);
    setCorrectAnswers(totalCorect);
  }

  const onIncorrectAnswer = (incorrectAnswer: string) => {
    const existingAnswers = state.loadIncorrectAnswers(currentLessonIndex) ?? [];
    const updatedAnswers = [...existingAnswers, incorrectAnswer];
    state.saveIncorrectAnswers(currentLessonIndex, updatedAnswers);
    setTotalIncorrectAnswers((prev) => prev + 1);
  };

  const onLessonStart = () => {
    state.resetLesson(currentLessonIndex)
    setLessonStartTime(Date.now());
    isShowLessonIntro(false);
  }

  const onContinue = () => {
    if (currentLessonIndex < lessons.length - 1) {
      const nextLessonIndex = currentLessonIndex + 1;
      setCurrentLessonIndex(nextLessonIndex);
      state.saveCurrentLesson(nextLessonIndex);
      setIsShowHome(true);
    } else {
      setIsCourseCompleted(true);
    }
  };

  const onLessonSelected = (lessonIndex: number) => {
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
    if (lessonStartTime) {
      setLessonDurationSeconds(Math.floor((Date.now() - lessonStartTime) / 1000));
      setLessonStartTime(null);
    }
  }

  const renderHeader = () => {
    if (isLessonActive) {
      return '';
    }
    return (
      <header>
        <div className="header-progress">
          <progress
            className="course-progress"
            value={currentLessonIndex}
            max={lessons.length}
            aria-label={t('course_progress')}
            title={`${t('all_lessons')} ${currentLessonIndex + 1} / ${lessons.length}`}
          />
        </div>

        <div className='header-text'>
          <h1 lang={config.targetLanguage}>{config.target.apptitle}</h1>
          <h2 lang={config.defaultLanguage}>{config.default.apptitle}</h2>
        </div>
      </header>
    );
  }

  const renderConditional = () => {
    if (isShowHome) {
      return (
        <HomeScreen>
          <Stats
            incorrectAnswers={totalIncorrectAnswers}
            questionsAnswered={totalQuestionsAnswered}
            correctAnswers={correctAnswers}
          />
          <LessonList
            currentLessonIndex={currentLessonIndex}
            lessons={lessonTitles2Indicies()}
            onLessonSelected={onLessonSelected}
          />
          <AboutComponent />
        </HomeScreen>
      )
    }

    if (isLessonIntro) {
      return (
        <LessonIntro
          title={currentLesson.title}
          description={currentLesson.description}
          index={currentLessonIndex}
          onContinue={() => onLessonStart()}
        />
      )
    }

    else if (islessonCompleted) {
      return (
        <LessonCompleted
          onContinue={onContinue}
          questionCount={currentLesson.cards.length}
          durationInSeconds={lessonDurationSeconds !== null ? lessonDurationSeconds : -1}
          mistakeCount={state.loadIncorrectAnswers(currentLessonIndex).length}
        />
      )
    }

    else if (isCourseFinished) {
      return (
        <CompletedAllLessons
          totalLessons={lessons.length}
        >
          <Stats incorrectAnswers={totalIncorrectAnswers}
            questionsAnswered={totalQuestionsAnswered}
            correctAnswers={correctAnswers}
          />
          <LessonList
            currentLessonIndex={currentLessonIndex}
            lessons={lessonTitles2Indicies()}
            onLessonSelected={onLessonSelected}
          />
        </CompletedAllLessons>
      )
    };

    return (
      <LessonComponent
        key={currentLessonIndex}
        lesson={currentLesson}
        onCancel={onLessonCancelled}
        onQuestionAnswered={onQuestionAnswered}
        onCorrectAnswer={onCorrectAnswer}
        onIncorrectAnswer={onIncorrectAnswer}
        onLessonComplete={onLessonComplete}
      />
    );
  };

  return (
    <main id='main'
      className={[
        isLessonActive ? "lesson-active" : "",
        isShowHome ? "home-active" : "",
      ].filter(Boolean).join(' ')}

    >
      {renderHeader()}
      {renderConditional()}
    </main>
  );
};

export default App;
