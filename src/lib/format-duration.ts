// lib/formatDuration.ts

import { type Ii18nT } from "../contexts/I18nProvider";

export const formatDuration = (t: Ii18nT, durationInSeconds: number,): string => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    let formattedTime = '';

    if (hours > 0) {
        formattedTime += `${hours} ${t('hours')}`;
    }

    if (minutes > 0 || hours > 0) {
        if (formattedTime) formattedTime += ' ';
        formattedTime += `${minutes} ${t('minutes')}`;
    }

    if (formattedTime) formattedTime += ', ';
    formattedTime += `${seconds} ${t('seconds')}`;

    return formattedTime;
};
