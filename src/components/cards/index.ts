import { IBaseCard } from './BaseCard.type';
import { IBlanksCard } from './Blanks/Blanks';
import { IDynamicVocabCard } from './DynamicVocab/DynamicVocab';
import { IMultipleChoiceCard } from './MultipleChoice/MultipleChoice';
import { IVocabMatchCard } from './VocabMatch/VocabMatch';
import { IWritingCard } from './Writing/Writing';
import { IWritingBlocksCard } from './WritingBlocks/WritingBlocks';

export * from './BaseCard.type';
export * from './MultipleChoice/MultipleChoice';
export * from './VocabMatch/VocabMatch';
export * from './Blanks/Blanks';
export * from './Writing/Writing';
export * from './WritingBlocks/WritingBlocks';
export * from './DynamicVocab/DynamicVocab';

export { default as MultipleChoiceComponent } from './MultipleChoice/MultipleChoice';

export { default as VocabMatchCardComponent } from './VocabMatch/VocabMatch';

export { default as BlanksCardComponent } from './Blanks/Blanks';

export { default as WritingCardComponent } from './Writing/Writing';

export { default as WritingBlocksCardComponent } from './WritingBlocks/WritingBlocks';

export { default as DynamicVocabComponent } from './DynamicVocab/DynamicVocab';

export type IAnyCard = IBlanksCard
    | IDynamicVocabCard
    | IMultipleChoiceCard
    | IVocabMatchCard
    | IWritingBlocksCard
    | IWritingCard;

export interface IAnyCardWithAnswer extends IBaseCard { answer: string };

export const CARD_CLASSES = ['writing-blocks', 'writing', 'vocab', 'multiple-choice', 'dynamic'];

export function isAnyCardWithAnswer(
    card: IAnyCard
): card is IAnyCard & { answer: string } {
    return typeof card === 'object' && card !== null && 'answer' in card;
}

