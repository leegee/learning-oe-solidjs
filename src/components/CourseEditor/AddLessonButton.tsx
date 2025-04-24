import "./AddLessonButton.css";
import { createResource, Show } from "solid-js";
import { useCourseStore, type ICourseStore } from "../../global-state/course";

export interface IAddLessonButtonProps {
    lessonIdx?: number;
    offset?: number;
}

export default function AddLessonButton(props: IAddLessonButtonProps) {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <button class='add-lesson utf8-icon-add'
                title='Add a new lesson to this course'
                onClick={() => courseStore()!.addLesson(props.lessonIdx, props.offset)}
            />
        </Show>
    );
}
