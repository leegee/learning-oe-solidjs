import Ajv from 'ajv';

import lessonsSchema from '../lessons.schema.json';
import lessonsData from '../lessons.json';
import { Lesson } from './components/Lesson';

const ajv = new Ajv();
const validate = ajv.compile(lessonsSchema);
const valid = validate(lessonsData);

if (!valid) {
    console.log('Invalid lesson JSON:', validate.errors);
}

export type LessonSummary = {
    title: string;
    index: number;
};

export const lessons: Lesson[] = lessonsData as Lesson[];

export const lessonTitles2Indicies = (): LessonSummary[] => {
    return lessonsData.map((lesson, lessonIndex) => ({
        title: lesson.title,
        index: lessonIndex
    }));
};

