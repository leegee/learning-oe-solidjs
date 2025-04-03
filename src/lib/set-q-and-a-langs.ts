import { IBaseCard } from '../components/cards/BaseCard.type';
const { loadConfig } = await import('../config');

const appConfig = await loadConfig();

export type setQandALangsReturnType = { q: string, a: string };

export const setQandALangs = (card: IBaseCard): setQandALangsReturnType => {
    if (card.alang && card.alang === card.qlang) {
        return {
            q: card.qlang,
            a: card.alang
        };
    }
    return {
        q: (card.qlang === 'default' ? appConfig.defaultLanguage : appConfig.targetLanguage) as string,
        a: (card.alang ?? (card.qlang === 'default' ? appConfig.targetLanguage : appConfig.defaultLanguage)) as string,
    };
};
