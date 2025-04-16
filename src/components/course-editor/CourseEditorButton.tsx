import './CourseEditorButton.css';
import { useNavigate } from "@solidjs/router";

export interface ICourseEditorButtonProps {
    courseIdx: number;
}

const CourseEditorButton = (props: ICourseEditorButtonProps) => {
    const navigate = useNavigate();

    return (
        <button class="course-editor-button" onClick={() => navigate('/dashboard/' + props.courseIdx)}>
            🖊️
        </button>
    );
};

export default CourseEditorButton;
