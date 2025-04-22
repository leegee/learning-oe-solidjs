import { useNavigate } from "@solidjs/router";
import { courseTitlesInIndexOrder } from "../../global-state/course";

const NewCourseButton = () => {
    const navigate = useNavigate();

    const handlClick = () => {
        const courseIdx = courseTitlesInIndexOrder().length;
        navigate('/editor/' + courseIdx);
    }

    return (
        <button class="large-icon-button" onClick={handlClick}>
            <i class='icon-cog' />
        </button>
    );
};

export default NewCourseButton;
