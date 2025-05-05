/*
* This is a singleton store. Loading of course data is async, 
* but this isn't needed on every init as the first instantiation 
* is cached and returned.
* 
* One course is in-memory at a time, indicated by `courseIdx`.
*/
import { createStore, type Store } from "solid-js/store";
import { makePersisted } from "@solid-primitives/storage";

import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { DefaultLesson, type ILesson } from "../components/Lessons/Lesson";
import { Config, loadConfig } from "../lib/config";
import { storageKeys } from "./keys";
import { LESSONS_JSON } from "../config/load-default-lessons";
import { createMemo } from "solid-js";
import { IAnyCard } from "../components/Cards";

export type ILessonSummary = {
    title: string;
    index: number;
};

export interface ICourseMetadata {
    title: string;
    description?: string;
    language: string;
    targetLanguage: string;
    level: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
}

const MetadataDefault = {
    title: 'New Course',
    description: 'A description',
    language: 'en',
    targetLanguage: 'en',
    level: 'level',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: [],
} as ICourseMetadata;

export interface ICourseData extends ICourseMetadata {
    lessons: ILesson[];
}

export interface ICourseDataStore {
    courseMetadata: ICourseMetadata | null;
    lessons: ILesson[];
    loading: boolean;
}

export interface ICourseStore {
    store: Store<{
        courseMetadata: ICourseMetadata | null;
        lessons: ILesson[];
        loading: boolean;
    }>;
    // setStore: SetStoreFunction<ICourseDataStore>;
    setCourse: (args: { lessons: ILesson[], courseMetadata: ICourseMetadata }) => void;
    getLessons: () => ILesson[];
    loadCourseFromFile: (index: number) => void;
    saveCourseToStorage: () => void;
    loadCourseFromStorage: (couseidx: number) => void;
    deleteCard: (lessonIdx: number, cardIdx: number) => void;
    saveCard: (card: IAnyCard, lessonIdx: number, cardIdx: number) => void;
    deleteCourse: (courseIdx: number) => void;
    getTotalLessonsCount: () => number;
    setLessons: (updatedLessons: ILesson[]) => void;
    addLesson: (lessonIdx?: number) => void;
    setTitle: (newTitle: string) => void;
    getTitle: () => string;
    setDescription: (newDesc: string) => void;
    getDescription: () => string;
    initNewCourse: (config: Config) => number;
    lessonTitles2Indicies: () => ILessonSummary[];
    reset: (courseIdx: number) => void;
}

const LessonsDefault: ILesson[] = [];
let courseStoreInstance: ICourseStore;
export const courseTitlesInIndexOrder = (config: Config): string[] => [...config.courses.map((course) => course.title)];

export const useCourseStore = async () => {
    if (!courseStoreInstance) {
        courseStoreInstance = await makeCourseStore();
    }
    return courseStoreInstance;
};

const makeCourseStore = async (): Promise<ICourseStore> => {
    const [store, setStore] = makePersisted(
        createStore<ICourseDataStore>({
            courseMetadata: null as ICourseMetadata | null,
            lessons: [] as ILesson[],
            loading: false,
        }),
        {
            name: storageKeys.STORE_NAME,
            storage: localStorage,
        }
    );

    // Load course config once
    let appConfigPromise: Promise<Awaited<ReturnType<typeof loadConfig>>> | null = null;
    const getAppConfig = () => {
        if (!appConfigPromise) appConfigPromise = loadConfig();
        return appConfigPromise;
    };

    const deleteCourse = async (courseIdx: number) => {
        const config = await getAppConfig();

        if (isNaN(courseIdx) || courseIdx < 0 || courseIdx >= config.courses.length) {
            throw new Error(`Invalid course index for deletion: ${courseIdx}`);
        }

        // config.courses.splice(courseIdx, 1);
        reset(courseIdx);

        const newIdx = 0;
        await loadCourseFromFile(newIdx);
    };

    const setCourse = ({ lessons, courseMetadata }: { lessons: ILesson[], courseMetadata: ICourseMetadata }) => {
        setStore({ lessons, courseMetadata });
    };


    /**
     * 
     * @param fileBasename - file name without extension
     * @throws 
     * @returns 
     */
    const loadFile = async (fileBasename: string): Promise<ICourseData> => {
        const filePath = `../../lessons/${fileBasename}.json`;
        console.info(`Loading course ${fileBasename} from ${filePath}`);

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

        console.info(`Loaded course ${fileBasename} from ${filePath}`);

        return courseData;
    }

    const saveCourseToStorage = () => {
        try {
            setStore("loading", true);
            setStore("loading", true);
            const course = {
                lessons: store.lessons,
                courseMetadata: store.courseMetadata,
            };
            localStorage.setItem('custom-lesson', JSON.stringify(course));
        } finally {
            setStore("loading", false);
        }
    }

    const loadCourseFromStorage = (courseIdx: number) => {
        console.log('loadCourseFromStorage enter');
        try {
            const storedCourse = JSON.parse(localStorage.getItem('custom-lesson') || '{}');
            setCourse({
                lessons: storedCourse.lessons,
                courseMetadata: storedCourse.courseMetadata!,
            });
            console.log('loadCourseFromStorage set ', storedCourse);
        } finally {
            setStore("loading", false);
        }
    }

    const loadCourseFromFile = async (courseIdx: number) => {
        const config = await getAppConfig();

        if (isNaN(courseIdx)) {
            return;
        }

        if (courseIdx === config.courses.length) {
            console.log('load course from storage')
            return loadCourseFromStorage(courseIdx);
        }

        if (courseIdx > config.courses.length) {
            console.warn("Invalid course index:", courseIdx);
            throw new InvalidCourseIndexError("Lesson out of range", courseIdx);
        }

        if (courseIdx < 0) {
            console.warn("Invalid course index:", courseIdx);
            throw new Error("Negative course index? " + courseIdx);
        }

        setStore("loading", true);

        const { fileBasename } = config.courses[courseIdx];

        try {
            const courseData = await loadFile(fileBasename);
            const { lessons, ...courseMetadata } = courseData;
            setCourse({
                lessons,
                courseMetadata,
            });
            setStore({ loading: false });
        } catch (error) {
            console.error("Error loading lessons:", error);
            setStore("loading", false);
        }
    }

    const getLessons = createMemo(() => store.lessons);

    const setLessons = (lessons: ILesson[]) => setStore({ "lessons": lessons, });

    const getTotalLessonsCount = createMemo(() => store.lessons.length);

    const addLesson = (insertAtLessonIdx?: number) => {
        setStore("lessons", (lessons) => {
            const newLesson = { ...DefaultLesson };
            if (insertAtLessonIdx === undefined || insertAtLessonIdx > lessons.length) {
                return [...lessons, newLesson];
            }

            if (insertAtLessonIdx <= 0) {
                return [newLesson, ...lessons];
            }

            return [
                ...lessons.slice(0, insertAtLessonIdx),
                { ...DefaultLesson },
                ...lessons.slice(insertAtLessonIdx)
            ];
        });
    };

    const initNewCourse = (config: Config): number => {
        console.trace('initNewCourse enter');
        const courseIdx = courseTitlesInIndexOrder(config).length;
        setStore({ loading: true });
        setCourse({
            lessons: [...LessonsDefault],
            courseMetadata: { ...MetadataDefault },
        });
        setStore({ loading: false });
        saveCourseToStorage();
        console.log('initNewCourse leave with', courseIdx);
        return courseIdx;
    };

    const CourseTitles2Indicies = (): ILessonSummary[] => {
        return store.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title,
            index: lessonIndex,
        }));
    };

    const saveCard = (updatedCard: IAnyCard, lessonIdx: number, cardIdx: number) => {
        const updatedLessons = store.lessons.map((lesson, lIdx) =>
            lIdx === lessonIdx
                ? {
                    ...lesson,
                    cards: lesson.cards.map((card, cIdx) =>
                        cIdx === cardIdx ? updatedCard : card
                    ),
                }
                : lesson
        );

        setLessons(updatedLessons);
        console.log('updated card')
    };


    const deleteCard = (lessonIdx: number, cardIdx: number) => {
        const updatedLessons = (store.lessons).map((lesson, i) =>
            i === lessonIdx
                ? { ...lesson, cards: lesson.cards.filter((_, j) => j !== cardIdx) }
                : lesson
        );
        setLessons(updatedLessons);
    }

    const reset = (courseIdx: number) => {
        const idx = courseIdx;
        localStorage.removeItem(storageKeys.CURRENT_LESSON_INDEX(idx));
        localStorage.removeItem(storageKeys.CURRENT_COURSE_INDEX);
        localStorage.removeItem(storageKeys.ANSWERS(idx));
        localStorage.removeItem(storageKeys.STORE_NAME);
    };

    const setTitle = (newTitle: string) => setStore("courseMetadata", "title", newTitle);;
    const getTitle = () => store.courseMetadata?.title ?? '';

    const setDescription = (newDesc: string) => setStore("courseMetadata", "description", newDesc);;
    const getDescription = () => store.courseMetadata?.description ?? '';

    return {
        store,
        // setStore,
        setTitle,
        getTitle,
        setDescription,
        getDescription,
        initNewCourse,
        saveCourseToStorage,
        loadCourseFromStorage,
        loadCourseFromFile,
        setCourse,
        deleteCourse,
        saveCard,
        deleteCard,
        setLessons,
        getTotalLessonsCount,
        getLessons,
        addLesson,
        lessonTitles2Indicies: CourseTitles2Indicies,
        reset,
    };
};


/**
 *  @example  throw new InvalidCourseIndexError("No such course as", courseIdx);
 */
export class InvalidCourseIndexError extends Error {
    public courseIdx: number;

    constructor(message: string, courseIdx: number) {
        super(message);
        this.name = this.constructor.name;
        this.courseIdx = courseIdx;
        Error.captureStackTrace(this, this.constructor);
    }
}

