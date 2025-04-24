import "./AddLessonButton.css";
import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export default function AddLessonButton() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <button class='add-lesson utf8-icon-add'
                title='Add a new lesson to this course'
                onClick={() => courseStore()!.addLesson(Number(params.courseIdx))}
            />
        </Show>
    );
}
