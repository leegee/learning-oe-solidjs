import { children, JSX } from "solid-js";

interface ICourseRootScreenProps {
    children?: JSX.Element;
}

const CourseRootLayout = (props: ICourseRootScreenProps) => {
    const resolvedChildren = children(() => props.children);

    return (
        <article id="main">
            {resolvedChildren()}
        </article>
    );
};

export default CourseRootLayout;
