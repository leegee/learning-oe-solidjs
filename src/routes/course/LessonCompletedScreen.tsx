import { useParams, useNavigate, useSearchParams } from "@solidjs/router";
import { createMemo, createResource, Show } from "solid-js";
import LessonCompleted from "../../components/Lessons/LessonCompleted";
import { useCourseStore } from "../../global-state/course";

const LessonCompletedScreen = () => {
    const [courseStore] = createResource(useCourseStore);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const courseIndex = createMemo(() => Number(params.courseIdx));
    const lessonIndex = createMemo(() => Number(params.lessonIdx));
    const duration = createMemo(() => Number(searchParams.duration) || -1);

    const nextLessonIndex = createMemo(() => lessonIndex() + 1);

    const onNext = () => {
        const store = courseStore();
        if (!store) {
            return;
        }

        if (nextLessonIndex() < store.store.lessons.length) {
            navigate(`/course/${courseIndex()}/${nextLessonIndex()}/intro`);
        } else {
            navigate(`/course/${courseIndex()}/finished`);
        }
    };

    return (
        <Show when={courseStore()}>
            <LessonCompleted
                onNext={onNext}
                durationInSeconds={duration()}
            />
        </Show>
    );
};

export default LessonCompletedScreen;
