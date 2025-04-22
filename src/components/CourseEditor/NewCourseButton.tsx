import { useNavigate } from "@solidjs/router";
import { useCourseStore, type ICourseStore } from "../../global-state/course";
import { createResource } from "solid-js";

const NewCourseButton = () => {
    const navigate = useNavigate();
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore());

    const handlClick = () => {
        if (courseStore.loading) return;
        const courseIdx = courseStore()!.getCourseIdx();
        navigate('/editor/' + courseIdx);
    }

    return (
        <button class="large-icon-button" onClick={handlClick}>
            <i class='icon-cog' />
        </button>
    );
};

export default NewCourseButton;
