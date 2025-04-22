import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { type Lesson } from "../components/Lessons/Lesson";
import { loadConfig } from "../lib/config";
import { storageKeys } from "./keys";
import { LESSONS_JSON } from "../config/lesson-loader";
import { useConfigContext } from "../contexts/ConfigProvider";

export type ILessonSummary = {
    title: string;
    index: number;
};

export interface ICourseMetadata {
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

export interface ICourseData extends ICourseMetadata {
    lessons: Lesson[];
}

export interface ICourseStore {
    store: {
        courseMetadata: ICourseMetadata | null;
        courseIdx: number;
        lessons: Lesson[];
        loading: boolean;
    };
    setCourseIdx: (index: number) => void;
    getCourseIdx: () => number;
    lessons: () => Lesson[];
    setLessons: (updated: Lesson[]) => void;
    lessonTitles2Indicies: () => ILessonSummary[];
    reset: (courseIdx?: number) => void;
}

let courseStoreInstance: ICourseStore;

export const courseTitlesInIndexOrder = (): string[] => {
    const { config } = useConfigContext();
    return [...config.courses.map((course) => course.title)];
}

export const useCourseStore = async (): Promise<ICourseStore> => {
    if (!courseStoreInstance) {
        courseStoreInstance = await makeCourseStore();
    }
    return Promise.resolve(courseStoreInstance);
}

export const makeCourseStore = () => {
    const [state, setState] = createStore({
        courseMetadata: null as ICourseMetadata | null,
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

    const setCourse = ({ lessons, courseMetadata }: { lessons: Lesson[], courseMetadata: ICourseMetadata }) => {
        setState({ lessons, courseMetadata });
    }

    // Load the course data
    createEffect(async () => {
        const index = state.courseIdx;
        const config = await getAppConfig();

        if (index === -1 || index >= config.courses.length) {
            console.warn("Invalid course index:", index);
            return;
        }

        const { fileBasename } = config.courses[index];
        const filePath = `../../lessons/${fileBasename}.json`;

        console.info("-----------Loading course:", fileBasename, filePath);
        setState("loading", true);

        try {
            const lessons = await LESSONS_JSON();
            if (!lessons[filePath]) {
                throw new Error('Lesson not found: ' + filePath);
            }
            const module = await lessons[filePath]();
            const courseData = (module as { default: ICourseData }).default;

            const ajv = new Ajv();
            const validate = ajv.compile(courseLessonsSchema);
            const valid = validate(courseData);

            if (!valid) {
                console.debug(JSON.stringify(validate.errors, null, 4));
                throw new TypeError("Invalid JSON");
            }

            setCourse({
                lessons: courseData.lessons,
                courseMetadata: { ...courseData },
            });
            setState({ loading: false });
        }

        catch (error) {
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

    const lessonTitles2Indicies = (): ILessonSummary[] => {
        return state.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title,
            index: lessonIndex,
        }));
    };

    const reset = (courseIdx?: number) => {
        const idx = courseIdx || getCourseIdx();
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
        setCourse,
        setCourseIdx,
        getCourseIdx,
        lessons,
        setLessons,
        lessonTitles2Indicies,
        reset,
    };
};
