import "./AddLessonButton.css";
import { createResource } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { DefaultLesson } from "../Lessons/Lesson";

export default function AddLessonButton() {
    const [courseStore] = createResource<ICourseStore, true>(useCourseStore);
    const params = useParams();
    const navigate = useNavigate();

    const handleClick = () => {
        const nextFreeLessonIdx = courseStore()!.lessons().length;

        courseStore()!.setLessons(
            Number(params.courseIdx),
            [
                ...courseStore()!.lessons(),
                DefaultLesson
            ]
        );

        const newCardIdx = courseStore()!.lessons().length - 1;
        navigate(`/editor/${params.courseIdx}/${nextFreeLessonIdx}/${newCardIdx}`);
    }

    return (
        <button class={'add-lesson'} onClick={() => handleClick()} title='Add a new lesson to this course'>
            <span class="utf8-icon-add" />
        </button>
    );
}
