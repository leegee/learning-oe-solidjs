import { IBaseCard } from '../components/Cards/BaseCard.type';
import { getCourseStore } from '../global-state/course';

export type setQandALangsReturnType = { q: string, a: string };

export const setQandALangs = async (card: IBaseCard): Promise<setQandALangsReturnType> => {
    const courseStore = getCourseStore();
    const sourceLang = courseStore.getSourceLang();
    const targetLang = courseStore.getTargetLang();

    if (card.alang && card.alang === card.qlang) {
        return {
            q: sourceLang,
            a: targetLang
        };
    }
    return {
        q: (card.qlang === 'default' ? sourceLang : targetLang) as string,
        a: (card.alang ?? (card.qlang === 'default' ? targetLang : sourceLang)) as string,
    };
};
