// import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";
import { useCourseStore } from "../../global-state/course";
import ResetCourseButtonComponent from "../../components/ResetCourseButton";

const CourseFinishedScreen = () => {
    // const params = useParams();
    // const courseIndex = Number(params.courseIdx);

    const [courseStore] = createResource(() => useCourseStore());

    if (courseStore.loading) {
        return <div>Loading...</div>;
    }

    return (
        <section>
            <ResetCourseButtonComponent />
        </section>
    );
};

export default CourseFinishedScreen;
