import { createResource } from "solid-js";
import { useNavigate, useParams } from "@solidjs/router";
import { courseTitlesInIndexOrder, useCourseStore, type ICourseStore } from "../../global-state/course";
import { useConfigContext } from "../../contexts/ConfigProvider";

const NewCourseButton = () => {
    const navigate = useNavigate();
    const { config } = useConfigContext();
    const params = useParams();
    const [courseStore] = createResource<ICourseStore>(() => useCourseStore(() => params.courseIdx));

    const handlClick = async () => {
        const courseIdx = courseTitlesInIndexOrder(config).length;
        if (courseStore.loading) return;
        await courseStore()!.initCourse(courseIdx);
        navigate('/editor/' + courseIdx + '/0/0');
    }

    return (
        <button class="large-icon-button" onClick={handlClick}>
            <i class='icon-cog' />
        </button>
    );
};

export default NewCourseButton;
