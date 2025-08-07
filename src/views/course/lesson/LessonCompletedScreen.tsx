import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { createMemo, Show } from "solid-js";
import LessonCompleted from "../../../components/Lessons/LessonCompleted";
import { getCourseStore } from "../../../global-state/course";

const LessonCompletedScreen = () => {
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const courseStore = getCourseStore();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));
    const lessonDuration = createMemo(() => Number(searchParams['lesson-duration']) || -999);

    const nextLessonIndex = createMemo(() => lessonIndex() + 1);

    const onNext = () => {
        if (!courseStore) {
            return;
        }

        if (nextLessonIndex() < courseStore.getLessons().length) {
            // Originally: navigate to next lesson
            // Currently: Back to course home screen:
            navigate(`/course/${courseIndex()}`);
        } else {
            navigate(`/course/${courseIndex()}/finished`);
        }
    };

    return (
        <Show when={courseStore}>
            <LessonCompleted
                onNext={onNext}
                lessonDurationInSeconds={lessonDuration()}
            />
        </Show>
    );
};

export default LessonCompletedScreen;
