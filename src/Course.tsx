import { courseStore, setSelectedCourse } from "./global-state/course";
import appConfig from "./config";

const CourseSelector = () => {
    return (
        <ul>
            {appConfig.lessons.map((course, index) => (
                <li class={courseStore.selectedCourseIndex === index ? 'selected' : ''}>
                    <button onClick={() => setSelectedCourse(index)}>
                        {course.title}
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default CourseSelector;
