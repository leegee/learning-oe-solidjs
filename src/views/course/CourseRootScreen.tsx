import { children, JSX } from "solid-js";

interface ICourseRootScreenProps {
    children?: JSX.Element;
}

const CourseRootScreen = (props: ICourseRootScreenProps) => {
    const resolvedChildren = children(() => props.children);

    return (
        <article id="main">
            {/* Here we hold all the children for our route, /course/:courseIdx/* */}
            {resolvedChildren()}
        </article>
    );
};

export default CourseRootScreen;
