import { createStore } from "solid-js/store";
import { createEffect, createRoot } from "solid-js";

import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { type Lesson } from "../components/Lessons/Lesson";
import { loadConfig } from "../lib/config";
import { storageKeys } from "./keys";

const LESSONS_DIR = "../../lessons";
const LESSONS_JSON = import.meta.glob("../../lessons/*.json");

const appConfig = await loadConfig();

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

export const courseStore = createRoot(() => {
    const [store, setStore] = createStore({
        courseMetadata: null as CourseMetadata | null,
        selectedCourseIndex: Number(localStorage.getItem(storageKeys.COURSE_INDEX)),
        lessons: [] as Lesson[],
        loading: false,
    });

    createEffect(async () => {
        const index = store.selectedCourseIndex;

        if (index === -1) {
            return;
        }

        if (index >= appConfig.lessons.length) {
            console.warn("Course index out of range");
            return;
        }

        console.info("-----------Loading course:", appConfig.lessons[index].fileBasename);
        setStore("loading", true);

        try {
            const filePath = `${LESSONS_DIR}/${appConfig.lessons[index].fileBasename}.json`;
            const module = await LESSONS_JSON[filePath]();
            const courseData = (module as { default: CourseData }).default;

            const ajv = new Ajv();
            const validate = ajv.compile(courseLessonsSchema);
            const valid = validate(courseData);

            if (!valid) {
                console.debug(JSON.stringify(validate.errors, null, 4));
                throw new TypeError("Invalid JSON");
            }

            setStore({
                lessons: courseData.lessons,
                courseMetadata: { ...courseData } as CourseMetadata,
                loading: false,
            });
        } catch (error) {
            console.error("Error loading lessons:", error);
        }
    });

    function setCourseIdx(index: number) {
        console.info("Selected course", index);
        setStore("selectedCourseIndex", index);
        localStorage.setItem(storageKeys.COURSE_INDEX, index.toString());
    }

    function getCourseIdx(): number {
        return store.selectedCourseIndex;
    }

    function lessonTitles2Indicies(): LessonSummary[] {
        return store.lessons.map((lesson, lessonIndex) => ({
            title: lesson.title,
            index: lessonIndex,
        }));
    }

    function reset() {
        localStorage.removeItem(storageKeys.CURRENT_LESSON_INDEX(getCourseIdx()));
        localStorage.removeItem(storageKeys.ANSWERS(getCourseIdx()));
        localStorage.removeItem(storageKeys.COURSE_INDEX);
        // setCurrentLessonIndex(-1);
        // TODO iterate over all courses and remove
    }

    return {
        store,
        getCourseIdx,
        setCourseIdx,
        lessonTitles2Indicies,
        reset
    };
});
