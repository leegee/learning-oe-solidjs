import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { type Lesson } from "../components/Lessons/Lesson";
import { loadConfig } from "../lib/config";
import { storageKeys } from "./keys";
import { LESSONS_JSON } from "../config/lesson-loader";

export type LessonSummary = {
    title: string;
    index: number;
};

export interface CourseMetadata {
    courseTitle: string;
    description?: string;
    language: string;
    targetLanguage: string;
    level: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    lessons: Lesson[];
}

export interface CourseData extends CourseMetadata {
    lessons: Lesson[];
}

export interface ICourseStore {
    store: {
        courseMetadata: CourseMetadata | null;
        courseIdx: number;
        lessons: Lesson[];
        loading: boolean;
    };
    setCourseIdx: (index: number) => void;
    getCourseIdx: () => number;
    lessons: () => Lesson[];
    setLessons: (updated: Lesson[]) => void;
    lessonTitles2Indicies: () => LessonSummary[];
    reset: () => void;
}

let courseStoreInstance: ICourseStore;

export const useCourseStore = async (): Promise<ICourseStore> => {
    if (!courseStoreInstance) {
        courseStoreInstance = await makeCourseStore();
    }
    return Promise.resolve(courseStoreInstance);
}

export const makeCourseStore = () => {
    const [state, setState] = createStore({
        courseMetadata: null as CourseMetadata | null,
        courseIdx: Number(localStorage.getItem(storageKeys.COURSE_INDEX)) || 0,
        lessons: [] as Lesson[],
        loading: false,
    });

    // Load course config once
    let appConfigPromise: Promise<Awaited<ReturnType<typeof loadConfig>>> | null = null;
    const getAppConfig = () => {
        if (!appConfigPromise) appConfigPromise = loadConfig();
        return appConfigPromise;
    };

    // Load the course data
    createEffect(async () => {
        const index = state.courseIdx;
        const config = await getAppConfig();

        if (index === -1 || index >= config.lessons.length) {
            console.warn("Invalid course index:", index);
            return;
        }

        const { fileBasename } = config.lessons[index];
        const filePath = `../../lessons/${fileBasename}.json`;

        console.info("-----------Loading course:", fileBasename);
        setState("loading", true);

        try {
            const module = await LESSONS_JSON()[filePath]();
            const courseData = (module as { default: CourseData }).default;

            const ajv = new Ajv();
            const validate = ajv.compile(courseLessonsSchema);
            const valid = validate(courseData);

            if (!valid) {
                console.debug(JSON.stringify(validate.errors, null, 4));
                throw new TypeError("Invalid JSON");
            }

            setState({
                lessons: courseData.lessons,
                courseMetadata: { ...courseData },
                loading: false,
            });
        } catch (error) {
            console.error("Error loading lessons:", error);
            setState("loading", false);
        }
    });

    const setCourseIdx = (index: number) => {
        console.info("Selected course", index);
        setState("courseIdx", index);
        localStorage.setItem(storageKeys.COURSE_INDEX, index.toString());
    };

    const getCourseIdx = () => state.courseIdx;

    const lessonTitles2Indicies = (): LessonSummary[] => {
        return state.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title,
            index: lessonIndex,
        }));
    };

    const reset = () => {
        const idx = getCourseIdx();
        localStorage.removeItem(storageKeys.CURRENT_LESSON_INDEX(idx));
        localStorage.removeItem(storageKeys.ANSWERS(idx));
        localStorage.removeItem(storageKeys.COURSE_INDEX);
    };

    const lessons = (): Lesson[] => state.lessons;

    const setLessons = (updated: Lesson[]) => {
        setState("lessons", updated);
        localStorage.setItem(storageKeys.EDITING_LESSON, JSON.stringify(state.lessons));
    };

    return {
        store: state,
        setCourseIdx,
        getCourseIdx,
        lessons,
        setLessons,
        lessonTitles2Indicies,
        reset,
    };
};
