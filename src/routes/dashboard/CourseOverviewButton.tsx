import './DashboardCourseOverview.css';
import { useLocation, useNavigate } from "@solidjs/router";

const CourseOverviewButton = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboardOpen = () => location.pathname.includes("/dashboard");

    const handleNavigation = () => {
        if (isDashboardOpen()) {
            navigate('/');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <button class="course-overview-button" onClick={handleNavigation}>
            {isDashboardOpen() ? "" : "🖊️"}
        </button>
    );
};

export default CourseOverviewButton;
