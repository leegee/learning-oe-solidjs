import Ajv from 'ajv';

import { type IMultipleChoiceCard } from './components/cards/MultipleChoice';
import { type IVocabMatchCard } from './components/cards/VocabMatch';
import { type IBlanksCard } from './components/cards/BlanksCard';
import { type IWritingCard } from './components/cards/WritingCard';
import { type IWritingBlocksCard } from './components/cards/WritingBlocksCard';
import { type IDynamicVocabCard } from './components/cards/DynamicVocabCard';

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
    cards: (IWritingCard | IWritingBlocksCard | IVocabMatchCard | IBlanksCard | IMultipleChoiceCard | IDynamicVocabCard)[];
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

