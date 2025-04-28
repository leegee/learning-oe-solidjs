import { createResource } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import { useConfigContext } from "../../contexts/ConfigProvider";
import { ICourseStore, useCourseStore } from "../../global-state/course";

const NewCourseButton = () => {
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const [courseStore] = createResource<ICourseStore>(useCourseStore);
    const params = useParams();

    const handlClick = async () => {

        if (courseStore.loading) return;
        const courseIdx = params.courseIdx;
        if (!courseIdx) return;

        const newIdx = courseStore()?.initNewCourse(config);
        navigate(`/editor/${newIdx}`);
        return;

    }

    return (
        <button title="Create a blank course" class="large-icon-button utf8-icon-new" onClick={handlClick} />
    );
};

export default NewCourseButton;
