// import { useParams } from "@solidjs/router";
import { createResource } from "solid-js";
import CompletedAllLessons from "../../components/Lessons/CompletedAllLessons";
import { useCourseStore } from "../../global-state/course";

const CourseFinishedScreen = () => {
    // const params = useParams();
    // const courseIndex = Number(params.courseIdx);

    const [courseStore] = createResource(() => useCourseStore());

    if (courseStore.loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <CompletedAllLessons totalLessons={courseStore()?.store.lessons.length || 0}>
                {/* Add course-specific stats  */}
            </CompletedAllLessons>
        </div>
    );
};

export default CourseFinishedScreen;
