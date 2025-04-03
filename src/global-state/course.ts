import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import { loadConfig } from "../config";
import { getCourseIndex, setCourseIndex } from "./lessons";
import { type Lesson } from '../components/Lesson';

const LESSONS_DIR = '../../lessons';
const LESSONS_JSON = import.meta.glob('../../lessons/*.json');

const appConfig = await loadConfig();

export type LessonSummary = {
    title: string;
    index: number;
};

export interface CourseMetadata {
    courseTitle: string;
    language: string;
    targetLanguage: string;
    level: string;
    createdAt: string;
    updatedAt: string;
    tags: string[];
    lessons: Lesson[];
};

export interface CourseData extends CourseMetadata {
    lessons: Lesson[];
};

export const [courseStore, setCourseStore] = createStore({
    courseMetadata: null as CourseMetadata | null,
    selectedCourseIndex: getCourseIndex(),
    lessons: [] as Lesson[],
    loading: false,
});

async function loadCourse(fileName: string): Promise<CourseData> {
    const filePath = `${LESSONS_DIR}/${fileName}.json`;

    if (LESSONS_JSON[filePath]) {
        try {
            const module = (await LESSONS_JSON[filePath]()) as { default: CourseData };
            return module.default;
        } catch (error) {
            console.error('Error loading JSON file:', error);
        }
    } else {
        console.error(`${filePath} not found`);
    }
    throw new Error('Could not load lesson: ' + filePath);
}

// Watch for changes in selectedCourseIndex and load course data
createEffect(async () => {
    const index = courseStore.selectedCourseIndex;

    if (index === -1) {
        return;
    }

    if (index >= appConfig.lessons.length) {
        console.warn('Course index out of range');
        return;
    }

    console.info("Loading course:", appConfig.lessons[index].fileBasename);
    setCourseStore("loading", true);

    try {
        const courseData: CourseData = await loadCourse(appConfig.lessons[index].fileBasename);

        if (!courseData) {
            throw new TypeError('Unexpected course lesson data');
        }

        const ajv = new Ajv();
        const validate = ajv.compile(courseLessonsSchema);
        const valid = validate(courseData);

        if (valid) {
            setCourseStore({
                lessons: courseData.lessons,
                courseMetadata: {
                    ...courseData
                } as CourseMetadata,
                loading: false,
            });
        } else {
            console.debug(JSON.stringify(validate.errors, null, 4));
            throw new TypeError('Invalid JSON');
        }
    } catch (error) {
        console.error("Error loading lessons:", error);
    }
});

export function setSelectedCourse(index: number) {
    console.info("Selected course", index);
    setCourseStore("selectedCourseIndex", index);
    setCourseIndex(index);
}

export function lessonTitles2Indicies(): LessonSummary[] {
    return courseStore.lessons.map((lesson, lessonIndex) => ({
        title: lesson.title,
        index: lessonIndex,
    }));
}
