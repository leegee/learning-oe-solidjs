import { useNavigate } from "@solidjs/router";

export interface ICourseEditorButtonProps {
    courseIdx: number;
}

const CourseEditorButton = (props: ICourseEditorButtonProps) => {
    const navigate = useNavigate();

    return (
        <button class="large-icon-button" onClick={() => navigate('/editor/' + props.courseIdx)}>
            {/* 🖊️ */}
            <i class='icon-cog' />
        </button>
    );
};

export default CourseEditorButton;
