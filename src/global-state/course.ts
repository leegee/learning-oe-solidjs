import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../../lessons.schema.json";
import appConfig from "../config";
import { getCourseIndex, setCourseIndex } from "../lessons-state";
import { type Lesson } from '../components/Lesson';

const LESSONS_DIR = '../../lessons';
const LESSONS_JSON = import.meta.glob('../../lessons/*.json');

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

// ** Define a reactive store **
export const [courseStore, setCourseStore] = createStore({
    courseMetadata: null as CourseMetadata | null,
    selectedCourseIndex: getCourseIndex(),
    lessons: [] as Lesson[],
    loading: false,
});

// ** Function to load a course **
async function loadCourse(fileName: string): Promise<CourseData> {
    const filePath = `${LESSONS_DIR}/${fileName}.json`;

    if (LESSONS_JSON[filePath]) {
        try {
            const module = (await LESSONS_JSON[filePath]()) as { default: CourseData };
            console.log('Loaded data:', module.default);
            return module.default;
        } catch (error) {
            console.error('Error loading JSON file:', error);
        }
    } else {
        console.error(`${filePath} not found`);
    }
    throw new Error('Could not load lesson: ' + filePath);
}

// ** Watch for changes in selectedCourseIndex and load course data **
createEffect(async () => {
    const index = courseStore.selectedCourseIndex;
    if (index === null || index >= appConfig.lessons.length) {
        console.log('Course index out of range');
        return;
    }

    console.info("Loading course:", appConfig.lessons[index].path);
    setCourseStore("loading", true);

    try {
        const courseData: CourseData = await loadCourse(appConfig.lessons[index].path);

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

// ** Actions **
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
