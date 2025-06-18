import { IBaseCard } from './BaseCard.type';
import { IBlanksCard } from './Blanks/Blanks';
import { IDynamicVocabCard } from './DynamicVocab/DynamicVocab';
import { IMultipleChoiceCard } from './MultipleChoice/MultipleChoice';
import { IVocabMatchCard } from './VocabMatch/VocabMatch';
import { IWritingCard } from './Writing/Writing';
import { IWritingBlocksCard } from './WritingBlocks/WritingBlocks';
import { defaultCard as defaultCardMultipleChoiceComponent } from './MultipleChoice/MultipleChoice';
import { defaultCard as defaultCardVocabMatchCardComponent } from './VocabMatch/VocabMatch';
import { defaultCard as defaultCardBlanksCardComponent } from './Blanks/Blanks';
import { defaultCard as defaultCardWritingCardComponent } from './Writing/Writing';
import { defaultCard as defaultCardWritingBlocksCardComponent } from './WritingBlocks/WritingBlocks';
import { defaultCard as defaultCardDynamicVocabComponent } from './DynamicVocab/DynamicVocab';
import { IAnyCard, IAnyCardWithAnswer } from './AnyCard.type';

export { default as MultipleChoiceComponent } from './MultipleChoice/MultipleChoice';
export { default as VocabMatchCardComponent } from './VocabMatch/VocabMatch';
export { default as BlanksCardComponent } from './Blanks/Blanks';
export { default as WritingCardComponent } from './Writing/Writing';
export { default as WritingBlocksCardComponent } from './WritingBlocks/WritingBlocks';
export { default as DynamicVocabComponent } from './DynamicVocab/DynamicVocab';
export type {
    IAnyCard, IAnyCardWithAnswer,
    IBaseCard, IBlanksCard, IDynamicVocabCard,
    IMultipleChoiceCard, IVocabMatchCard, IWritingCard,
    IWritingBlocksCard
};

const defaultCardMap: Record<CardClass, IAnyCard> = {
    'blanks': defaultCardBlanksCardComponent,
    'dynamic-vocab': defaultCardDynamicVocabComponent,
    'multiple-choice': defaultCardMultipleChoiceComponent,
    'vocab': defaultCardVocabMatchCardComponent,
    'writing-blocks': defaultCardWritingBlocksCardComponent,
    'writing': defaultCardWritingCardComponent,
};

export const createDefaultCard = (klass: CardClass): IAnyCard => {
    return structuredClone(defaultCardMap[klass]);
}


export const CARD_CLASSES = [
    'blanks',
    'dynamic-vocab',
    'multiple-choice',
    'vocab',
    'writing-blocks',
    'writing',
];

export type CardClass = typeof CARD_CLASSES[number];

export function isAnyCardWithAnswer(
    card: IAnyCard
): card is IAnyCard & { answer: string } {
    return typeof card === 'object' && card !== null && 'answer' in card;
}

