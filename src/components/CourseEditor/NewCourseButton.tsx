import { useNavigate } from "@solidjs/router";

const NewCourseButton = () => {
    const navigate = useNavigate();

    const handlClick = async () => {
        navigate('/editor/init');
    }

    return (
        <button class="large-icon-button" onClick={handlClick}>
            <i class='icon-cog' />
        </button>
    );
};

export default NewCourseButton;
