import { Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useConfigContext } from "../../contexts/ConfigProvider";
import { getCourseStore } from "../../global-state/course";
import { useLessonStore } from "../../global-state/answers";

const NewCourseButton = () => {
    const navigate = useNavigate();
    const { config } = useConfigContext();

    const handleClick = async () => {
        const courseStore = getCourseStore();
        if (!courseStore) return;

        const courseIdx = courseStore.initNewCourse(config);
        if (courseIdx !== undefined) {
            useLessonStore(courseIdx);
            navigate(`/editor/${courseIdx}`);
        } else {
            alert("Error creating new course");
        }
    };

    const courseStore = getCourseStore();

    return (
        <Show when={courseStore}>
            <button
                title="Create a blank course"
                class="large-icon-button utf8-icon-new"
                onClick={handleClick}
            />
        </Show>
    );
};

export default NewCourseButton;
