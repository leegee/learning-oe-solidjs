import { children, JSX } from "solid-js";

interface ICourseRootScreenProps {
    children?: JSX.Element;
}

// A host to whatever course is specified later in the URL
const CourseRootScreen = (props: ICourseRootScreenProps) => {
    const resolvedChildren = children(() => props.children);

    return (
        <article id="main">
            {resolvedChildren()}
        </article>
    );
};

export default CourseRootScreen;
