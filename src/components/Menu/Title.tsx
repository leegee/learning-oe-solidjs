import { createSignal, onCleanup, onMount } from "solid-js";
import './Title.css';

interface ITitleComponentProps {
    title: string;
}

const TitleComponent = (props: ITitleComponentProps) => {
    const [visible, setVisible] = createSignal(false);
    let elementRef!: HTMLHeadingElement;

    onMount(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisible(true);
                    observer.unobserve(elementRef);
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(elementRef);

        onCleanup(() => observer.disconnect());
    });

    return (
        <h1
            ref={elementRef}
            class="animated-text"
            classList={{ visible: visible() }}
        >
            {props.title}
        </h1>
    )

}


export default TitleComponent;