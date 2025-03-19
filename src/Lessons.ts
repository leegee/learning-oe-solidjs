import Ajv from 'ajv';

import { type MultipleChoiceCard } from './components/cards/MultipleChoice';
import { type VocabCard } from './components/cards/VocabMatch';
import { type BlanksCard } from './components/cards/BlanksCard';
import { type WritingCard } from './components/cards/WritingCard';
import { type WritingBlocksCard } from './components/cards/WritingBlocksCard';
import { type DynamicVocabCard } from './components/cards/DynamicVocabCard';

import lessonsSchema from '../lessons.schema.json';
import lessonsData from '../lessons.json';

const ajv = new Ajv();
const validate = ajv.compile(lessonsSchema);
const valid = validate(lessonsData);

if (!valid) {
    console.log('Invalid lesson JSON:', validate.errors);
}

export type Lesson = {
    title: string;
    description?: string;
    cards: (WritingCard | WritingBlocksCard | VocabCard | BlanksCard | MultipleChoiceCard | DynamicVocabCard)[];
};

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

