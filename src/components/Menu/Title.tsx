import { createSignal, onCleanup, createEffect } from "solid-js";
import './Title.css';

interface ITitleComponentProps {
    title: string;
}

const TitleComponent = (props: ITitleComponentProps) => {
    const [visible, setVisible] = createSignal(false);
    let elementRef: HTMLHeadingElement | undefined;

    createEffect(() => {
        if (elementRef) {
            let observer: IntersectionObserver;

            const setup = () => {
                observer = new IntersectionObserver(
                    (entries) => {
                        if (entries[0].isIntersecting) {
                            setVisible(true);
                            observer.unobserve(elementRef!);
                        }
                    },
                    { threshold: 0.1 }
                );

                observer.observe(elementRef);
            };

            requestAnimationFrame(setup);

            onCleanup(() => {
                observer?.disconnect();
            });
        }
    });

    return (
        <h1 ref={elementRef} classList={{ visible: visible() }} >
            {props.title}
        </h1>
    );
};

export default TitleComponent;
