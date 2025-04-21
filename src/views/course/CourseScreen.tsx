import { children, JSX } from "solid-js";

interface ICourseScreenProps {
    children?: JSX.Element;
}

const CourseScreen = (props: ICourseScreenProps) => {
    const resolvedChildren = children(() => props.children);

    return (
        <article id="main">
            {resolvedChildren()}
        </article>
    );
};

export default CourseScreen;
