import { useNavigate } from "@solidjs/router";
import { RouteFragementInitCourse } from "../../Routes";

const NewCourseButton = () => {
    const navigate = useNavigate();

    const handlClick = async () => {
        navigate('/editor/' + RouteFragementInitCourse);
    }

    return (
        <button title="Create a blank course" class="large-icon-button utf8-icon-new" onClick={handlClick} />
    );
};

export default NewCourseButton;
