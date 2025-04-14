import { children, JSX } from "solid-js";

interface ICourseComponentProps {
    children?: JSX.Element;
}

const CourseComponent = (props: ICourseComponentProps) => {
    const resolvedChildren = children(() => props.children);

    return (
        <article id="main">
            {resolvedChildren()}
        </article>
    );
};

export default CourseComponent;
