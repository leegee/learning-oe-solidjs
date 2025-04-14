import { useParams } from "@solidjs/router";
import CompletedAllLessons from "./CompletedAllLessons";
import { courseStore } from "../../global-state/course";

const CourseFinishedScreen = () => {
    const params = useParams();
    const courseIndex = Number(params.courseIdx);

    return (
        <CompletedAllLessons totalLessons={courseStore.store.lessons.length}>
            {/* Add course-specific stats if you like */}
        </CompletedAllLessons>
    );
};

export default CourseFinishedScreen;
