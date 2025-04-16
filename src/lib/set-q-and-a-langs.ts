import { IBaseCard } from '../components/Cards/BaseCard.type';
import { useConfigContext } from '../contexts/Config';

export type setQandALangsReturnType = { q: string, a: string };

export const setQandALangs = (card: IBaseCard): setQandALangsReturnType => {
    const { config } = useConfigContext();
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
