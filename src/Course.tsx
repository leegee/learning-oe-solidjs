import { createSignal, createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../lessons.schema.json";
import appConfig from "./config";
import { getCourseIndex, setCourseIndex } from "./lessons-state";
import { type Lesson } from './components/Lesson';

const LESSONS_DIR = '../lessons';
const LESSONS_JSON = import.meta.glob('../lessons/*.json');

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

// Global reactive state
const [_courseMetadata, setCourseMetadata] = createSignal<CourseMetadata | null>(null);
const [localSelectedCourseIndex, setLocalSelectedCourseIndex] = createSignal<number | null>(null);
const [_lessons, setLessons] = createSignal<Lesson[]>([]);
const [_loading, setLoading] = createSignal(true);

setLocalSelectedCourseIndex(getCourseIndex());

// Load lessons when `selectedCourseIndex` changes
createEffect(async () => {
    const index = localSelectedCourseIndex();
    if (index === null || index >= appConfig.lessons.length) {
        console.log('Course index out of range');
        return;
    }

    console.info("Loading course:", appConfig.lessons[index].path);
    setLoading(true);

    try {
        const courseData: CourseData = await loadCourse(
            appConfig.lessons[index].path
        );

        if (!courseData) {
            throw new TypeError('Unexecpted course lesson data');
        }

        const ajv = new Ajv();
        const validate = ajv.compile(courseLessonsSchema);
        const valid = validate(courseData);

        if (valid) {
            setLessons(courseData.lessons as Lesson[]);
            const { lessons, ...courseMetadata } = courseData;
            setCourseMetadata(courseMetadata as CourseMetadata);
            setLoading(false);
        }
        else {
            console.debug(JSON.stringify(validate.errors, null, 4))
            throw new TypeError('Invalid JSON');
        }
    }
    catch (error) {
        console.error("Error loading lessons:", error);
        throw error;
    }
    finally {

    }
});

// Export reactive signals for use anywhere in the app
export const courseMetadata = _courseMetadata;
export const lessons = _lessons;
export const loadingCourse = _loading;

// Function to change the selected course from anywhere
export const setSelectedCourse = (index: number) => {
    console.info("Selected course", index);
    setLocalSelectedCourseIndex(index);
    setCourseIndex(index);
};

export const lessonTitles2Indicies = (): LessonSummary[] => {
    return _lessons().map((lesson, lessonIndex) => ({
        title: lesson.title,
        index: lessonIndex,
    }));
};

const CourseSelector = () => {
    return (
        <>
            {appConfig.lessons.map((course, index) => (
                <li class={localSelectedCourseIndex() === index ? 'selected' : ''}>
                    <button onClick={() => setSelectedCourse(index)}>
                        {course.title}
                    </button>
                </li>
            ))}
        </>
    );
};

export default CourseSelector;

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
