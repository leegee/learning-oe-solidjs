import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { createMemo } from "solid-js";
import LessonCompleted from "./LessonCompleted";
import { courseStore } from "../../global-state/course";

const LessonCompletedScreen = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));
    const duration = createMemo(() => Number(searchParams.duration) || -1);

    const nextLessonIndex = createMemo(() => lessonIndex() + 1);

    const onNext = () => {
        if (nextLessonIndex() < courseStore.store.lessons.length) {
            navigate(`/course/${courseIndex()}/${nextLessonIndex()}/intro`);
        } else {
            navigate(`/course/${courseIndex()}/finished`);
        }
    };

    return (
        <LessonCompleted
            onNext={onNext}
            durationInSeconds={duration()}
        />
    );
};

export default LessonCompletedScreen;
