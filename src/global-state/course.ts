import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { type Lesson } from "../components/Lessons/Lesson";
import { Config, loadConfig } from "../lib/config";
import { storageKeys } from "./keys";
import { LESSONS_JSON } from "../config/lesson-loader";

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

const LessonsDefault: Lesson[] = [];

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
    getCourseIdx: () => number;
    lessons: () => Lesson[];
    setLessons: (courseIdx: number, updatedLessons: Lesson[]) => void;
    initCourse: (courseIdx: number) => void;
    lessonTitles2Indicies: () => ILessonSummary[];
    reset: (courseIdx?: number) => void;
}

let courseStoreInstance: ICourseStore;
export const courseTitlesInIndexOrder = (config: Config): string[] => [...config.courses.map((course) => course.title)];

export const useCourseStore = async (getCourseIdxSignal: () => string | number): Promise<ICourseStore> => {
    if (!courseStoreInstance) {
        courseStoreInstance = await makeCourseStore(getCourseIdxSignal);
    }
    return Promise.resolve(courseStoreInstance);
};

export const makeCourseStore = async (getCourseIdxSignal: () => string | number): Promise<ICourseStore> => {
    const [state, setState] = createStore({
        courseMetadata: null as ICourseMetadata | null,
        courseIdx: Number(getCourseIdxSignal()),
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
    };

    // Reactive effect watching external signal
    createEffect(async () => {
        const courseIdx = Number(getCourseIdxSignal());
        setState("courseIdx", courseIdx);

        console.debug('# Enter course store effect: signal set courseIdx to', courseIdx);

        const config = await getAppConfig();

        console.log('course effect: config', config.courses.length);

        if (courseIdx < 0) {
            console.warn("# Invalid course index:", courseIdx);
            throw new Error("Negative course index? " + courseIdx);
        }
        if (courseIdx >= config.courses.length) {
            console.warn("# Invalid course index:", courseIdx);
            throw new InvalidCourseIndexError("Future lesson?", courseIdx);
        }

        const { fileBasename } = config.courses[courseIdx];
        const filePath = `../../lessons/${fileBasename}.json`;

        console.info(`# Loading course ${fileBasename} from ${filePath}`);
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

    const lessons = (): Lesson[] => state.lessons;

    const setLessons = (courseIdx: number, updated: Lesson[]) => {
        setState("lessons", updated);
        localStorage.setItem(storageKeys.LESSONS(courseIdx), JSON.stringify(state.lessons));
    };

    const initCourse = (courseIdx: number) => {
        setState({ loading: true });
        setLessons(courseIdx, []);
        setCourse({
            lessons: [...LessonsDefault],
            courseMetadata: { ...MetadataDefault },
        });
        setState({ loading: false });
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
    };

    return {
        store: state,
        initCourse,
        setCourse,
        setCourseIdx,
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

