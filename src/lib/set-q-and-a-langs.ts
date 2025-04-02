import { IBaseCard } from '../components/cards/BaseCard.type';
import config from '../config';

export type setQandALangsReturnType = { q: string, a: string };

export const setQandALangs = (card: IBaseCard): setQandALangsReturnType => {
    if (card.alang && card.alang === card.qlang) {
        return {
            q: card.qlang,
            a: card.alang
        };
    }
    return {
        q: (card.qlang === 'default' ? config.defaultLanguage : config.targetLanguage) as string,
        a: (card.alang ?? (card.qlang === 'default' ? config.targetLanguage : config.defaultLanguage)) as string,
    };
};
