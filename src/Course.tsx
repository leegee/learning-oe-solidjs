import { createSignal, createEffect } from "solid-js";
import Ajv from "ajv";
import courseLessonsSchema from "../lessons.schema.json";
import appConfig from "./config";
import { Lesson } from './components/Lesson';

export type LessonSummary = {
    title: string;
    index: number;
};

// Global reactive state
const [selectedCourseIndex, setSelectedCourseIndex] = createSignal<number | null>(null);
const [_lessons, setLessons] = createSignal<Lesson[]>([]);
const [_loading, setLoading] = createSignal(true);

// Load saved course selection from localStorage on startup
const savedIndex = localStorage.getItem("selectedCourseIndex");
if (savedIndex !== null) {
    setSelectedCourseIndex(parseInt(savedIndex, 10));
}

// Load lessons when `selectedCourseIndex` changes
createEffect(async () => {
    const index = selectedCourseIndex();
    if (index === null || index >= appConfig.lessons.length) return;

    console.info("Loading course:", appConfig.lessons[index].path);
    setLoading(true);

    try {
        const lessonsData: Lesson[] = (await import(appConfig.lessons[index].path)).default;
        console.info("Course loaded successfully");

        const ajv = new Ajv();
        const validate = ajv.compile(courseLessonsSchema);
        const valid = validate(lessonsData);

        if (valid) {
            setLessons(lessonsData);
        } else {
            console.error("Invalid lesson JSON:", validate.errors);
        }
    } catch (error) {
        console.error("Error loading lessons:", error);
    } finally {
        setLoading(false);
    }
});

// Export reactive signals for use anywhere in the app
export const lessons = _lessons;
export const loadingCourse = _loading;

// Function to change the selected course from anywhere
export const setSelectedCourse = (index: number) => {
    console.info("Selected course", index);
    setSelectedCourseIndex(index);
    localStorage.setItem("selectedCourseIndex", index.toString());
};

export const lessonTitles2Indicies = (): LessonSummary[] => {
    return _lessons().map((lesson, lessonIndex) => ({
        title: lesson.title,
        index: lessonIndex,
    }));
};

const CourseSelector = () => {
    return (
        <ul>
            {appConfig.lessons.map((course, index) => (
                <li class={selectedCourseIndex() === index ? 'selected' : ''}>
                    <button onClick={() => setSelectedCourse(index)}>
                        {course.title}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default CourseSelector;
