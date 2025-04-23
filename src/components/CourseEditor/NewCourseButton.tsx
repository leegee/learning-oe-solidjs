import { useNavigate } from "@solidjs/router";

const NewCourseButton = () => {
    const navigate = useNavigate();

    const handlClick = async () => {
        navigate('/editor/init');
    }

    return (
        <button title="Create a blank course" class="large-icon-button utf8-icon-new" onClick={handlClick} />
    );
};

export default NewCourseButton;
