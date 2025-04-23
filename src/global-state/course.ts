/*
* This is a singleton store. Loading of course data is async, 
* but this isn't needed on every init as the first instantiation 
* is cached and returned.
*/
import { createStore } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { type Lesson } from "../components/Lessons/Lesson";
import { Config, loadConfig } from "../lib/config";
import { storageKeys } from "./keys";
import { LESSONS_JSON } from "../config/load-default-lessons";

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
}

const MetadataDefault = {
    courseTitle: 'New Course',
    description: 'A description',
    language: 'en',
    targetLanguage: 'en',
    level: 'level',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
} as ICourseMetadata;

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
    setCourse: (args: { lessons: Lesson[], courseMetadata: ICourseMetadata }) => void;
    setCourseIdx: (index: number) => void;
    loadCourse: (index: number) => void;
    getCourseIdx: () => number;
    lessons: () => Lesson[];
    setLessons: (courseIdx: number, updatedLessons: Lesson[]) => void;
    initCourse: (courseIdx: number) => void;
    lessonTitles2Indicies: () => ILessonSummary[];
    reset: (courseIdx?: number) => void;
}

const LessonsDefault: Lesson[] = [];
let courseStoreInstance: ICourseStore;
export const courseTitlesInIndexOrder = (config: Config): string[] => [...config.courses.map((course) => course.title)];

const STORE_NAME = 'oe-courses';

export const useCourseStore = async () => {
    if (!courseStoreInstance) {
        courseStoreInstance = await makeCourseStore();
    }
    return courseStoreInstance;
};

const makeCourseStore = async () => {
    const [state, setState] = makePersisted(
        createStore({
            courseMetadata: null as ICourseMetadata | null,
            courseIdx: Number(localStorage.getItem(storageKeys.COURSE_INDEX) || 0),
            lessons: [] as Lesson[],
            loading: false,
        }),
        {
            name: STORE_NAME,
            storage: localStorage,
        }
    );

    // Load course config once
    let appConfigPromise: Promise<Awaited<ReturnType<typeof loadConfig>>> | null = null;
    const getAppConfig = () => {
        if (!appConfigPromise) appConfigPromise = loadConfig();
        return appConfigPromise;
    };

    const setCourse = ({ lessons, courseMetadata }: { lessons: Lesson[], courseMetadata: ICourseMetadata }) => {
        setState({ lessons, courseMetadata });
    };

    // Reactive effect watching external signal for the index of the current course within (or without) LESSONS_JSON
    const loadCourse = async (courseIdx: number) => {
        const config = await getAppConfig();

        if (isNaN(courseIdx)) {
            return;
        }

        if (courseIdx >= config.courses.length) {
            console.warn('Course index out of bounds:', courseIdx, '>=', config.courses.length);
            return;
        }

        setState("courseIdx", courseIdx);

        if (courseIdx < 0) {
            console.warn("Invalid course index:", courseIdx);
            throw new Error("Negative course index? " + courseIdx);
        }
        if (courseIdx >= config.courses.length) {
            console.warn("Invalid course index:", courseIdx);
            throw new InvalidCourseIndexError("Future lesson?", courseIdx);
        }

        setState("loading", true);

        const { fileBasename } = config.courses[courseIdx];
        const filePath = `../../lessons/${fileBasename}.json`;

        console.info(`Loading course ${fileBasename} from ${filePath}`);

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
        } catch (error) {
            console.error("Error loading lessons:", error);
            setState("loading", false);
        }
    }

    const setCourseIdx = (index: number) => {
        if (isNaN(index)) {
            console.warn('setCourseIdx to NaN? No');
            return;
        }
        const actual = isNaN(index) ? 0 : index;
        setState("courseIdx", actual);
    };

    const getCourseIdx = () => state.courseIdx;

    const lessons = (): Lesson[] => state.lessons;

    const setLessons = (courseIdx: number, lessons: Lesson[]) => {
        setState("lessons", lessons);
        setState("courseIdx", courseIdx);
    };

    const initCourse = (courseIdx: number) => {
        console.log('initCourse enter');
        setState({ loading: true });
        setCourse({
            lessons: [...LessonsDefault],
            courseMetadata: { ...MetadataDefault },
        });
        setCourseIdx(courseIdx);
        setState({ loading: false });
        console.log('initCourse done');
    };

    const CourseTitles2Indicies = (): ILessonSummary[] => {
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
        localStorage.removeItem(STORE_NAME);
    };

    return {
        store: state,
        initCourse,
        setCourse,
        setCourseIdx,
        loadCourse,
        getCourseIdx,
        lessons,
        setLessons,
        lessonTitles2Indicies: CourseTitles2Indicies,
        reset,
    };
};


// @example  throw new InvalidCourseIndexError("No such course as", courseIdx);
class InvalidCourseIndexError extends Error {
    public courseIdx: number;

    constructor(message: string, courseIdx: number) {
        super(message);
        this.name = this.constructor.name;
        this.courseIdx = courseIdx;
        Error.captureStackTrace(this, this.constructor); // Capture stack trace (optional)
    }
}

