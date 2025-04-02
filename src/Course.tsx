import { courseStore, setSelectedCourse } from "./global-state/course";
import { loadConfig } from "./config";

const appConfig = await loadConfig();

const CourseSelector = () => {
    return (
        <>
            {appConfig.lessons.map((course, index) => (
                <li class={courseStore.selectedCourseIndex === index ? 'selected' : ''}>
                    <button onClick={() => setSelectedCourse(index)}>
                        {course.title}
                    </button>
                </li>
            ))}
        </>
    );
};

export default CourseSelector;
