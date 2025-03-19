import { Card } from '../components/cards/Card';
import config from '../config';

export type setQandALangsReturnType = { q: string, a: string };

export const setQandALangs = (card: Card): setQandALangsReturnType => {
    return {
        q: (card.qlang === 'default' ? config.defaultLanguage : config.targetLanguage) as string,
        a: (card.alang ?? (card.qlang === 'default' ? config.targetLanguage : config.defaultLanguage)) as string,
    };
};
