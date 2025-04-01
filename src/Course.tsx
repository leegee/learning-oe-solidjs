import Ajv from 'ajv';
import { Lesson } from './components/Lesson';
import courseLessonsSchema from '../lessons.schema.json';
// import lessonsData from '../lessons.json';
import appConfig from './config';

export type LessonSummary = {
    title: string;
    index: number;
};

const courseLessons: Lesson[] = (await import(appConfig.lessons[0].path)).default;

console.log(courseLessons)

const ajv = new Ajv();
const validate = ajv.compile(courseLessonsSchema);
const valid = validate(courseLessons);

if (!valid) {
    console.log('Invalid lesson JSON:', validate.errors);
}

export const lessons: Lesson[] = courseLessons as Lesson[];

export const lessonTitles2Indicies = (): LessonSummary[] => {
    return courseLessons.map((lesson, lessonIndex) => ({
        title: lesson.title,
        index: lessonIndex
    }));
};

