import "./AddLessonButton.css";
import { createResource, Show } from "solid-js";
import { useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { DefaultLesson } from "../Lessons/Lesson";

export default function AddLessonButton() {
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();

    const handleClick = () => {
        const store = courseStore();
        if (courseStore.loading || !store) return;

        store.setLessons(
            Number(params.courseIdx),
            [
                ...store.lessons(),
                DefaultLesson
            ]
        );
    }

    return (
        <Show when={!courseStore.loading} fallback={<p>Loading...</p>}>
            <button class='add-lesson utf8-icon-add' onClick={() => handleClick()} title='Add a new lesson to this course' />
        </Show>
    );
}
