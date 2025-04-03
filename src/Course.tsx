import { courseStore, setSelectedCourse } from "./global-state/course";
import { useConfigContext } from "./contexts/Config";


const CourseSelector = () => {
    const { config } = useConfigContext();
    return (
        <>
            {config.lessons.map((course, index) => (
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
