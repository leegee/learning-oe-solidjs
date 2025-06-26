import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { createMemo, createResource, Show } from "solid-js";
import LessonCompleted from "../../../components/Lessons/LessonCompleted";
import { useCourseStore } from "../../../global-state/course";

const LessonCompletedScreen = () => {
    const [courseStore] = createResource(useCourseStore);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));
    const lessonDuration = createMemo(() => Number(searchParams['lesson-duration']) || -999);

    const nextLessonIndex = createMemo(() => lessonIndex() + 1);

    const onNext = () => {
        const store = courseStore();
        if (!store) {
            return;
        }

        if (nextLessonIndex() < store.getLessons().length) {
            navigate(`/course/${courseIndex()}/${nextLessonIndex()}/intro`);
        } else {
            navigate(`/course/${courseIndex()}/finished`);
        }
    };

    return (
        <Show when={courseStore()}>
            <LessonCompleted
                onNext={onNext}
                lessonDurationInSeconds={lessonDuration()}
            />
        </Show>
    );
};

export default LessonCompletedScreen;
