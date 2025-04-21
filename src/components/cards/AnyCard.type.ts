import { IBaseCard } from "./BaseCard.type";
import { IBlanksCard } from "./Blanks/Blanks";
import { IDynamicVocabCard } from "./DynamicVocab/DynamicVocab";
import { IMultipleChoiceCard } from "./MultipleChoice/MultipleChoice";
import { IVocabMatchCard } from "./VocabMatch/VocabMatch";
import { IWritingCard } from "./Writing/Writing";
import { IWritingBlocksCard } from "./WritingBlocks/WritingBlocks";

export type IAnyCard = IBlanksCard
    | IDynamicVocabCard
    | IMultipleChoiceCard
    | IVocabMatchCard
    | IWritingBlocksCard
    | IWritingCard;

export interface IAnyCardWithAnswer extends IBaseCard { answer: string };
