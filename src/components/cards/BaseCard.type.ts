import { CardClass } from "./index";

export type IBaseCard = {
    class: CardClass;
    question?: string;
    qlang: 'default' | 'target';
    alang?: 'default' | 'target';
}

