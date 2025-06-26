import './LessonProgressIndicator.css';

import { useI18n } from "../../../contexts/I18nProvider";

export interface iLessonProgressIndicatorProps {
    value: number;
    max: number;
    title: string;
};

export default function LessonProgressIndicator(props: iLessonProgressIndicatorProps) {
    const { t } = useI18n();

    return (
        <progress
            class='leeson-progress'
            value={props.value}
            max={props.max}
            aria-label={t('lesson_progress')}
            title={props.title}
        />
    );
}