import { createResource, Show } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { useConfigContext } from "../../contexts/ConfigProvider";
import { ICourseStore, useCourseStore } from "../../global-state/course";
import { useLessonStore } from "../../global-state/answers";

const NewCourseButton = () => {
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [courseStore] = createResource<ICourseStore>(useCourseStore);

    const handlClick = async () => {
        if (courseStore.loading) return;

        const courseIdx = courseStore()!.initNewCourse(config);
        if (courseIdx) {
            useLessonStore(courseIdx);
            navigate(`/editor/${courseIdx}`);
        } else {
            alert('Error creating new course');
        }
    }

    return (
        <Show when={!courseStore.loading}>
            <button title="Create a blank course" class="large-icon-button utf8-icon-new" onClick={handlClick} />
        </Show>
    );
};

export default NewCourseButton;
