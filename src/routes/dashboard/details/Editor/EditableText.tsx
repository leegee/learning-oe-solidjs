import { createEffect } from "solid-js";

interface EditableTextProps {
    value: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    class?: string;
}

export default function EditableText(
    props: EditableTextProps
) {
    let el: HTMLElement;

    const sanitize = (text: string) => text.replace(/[\r\n]+/g, "").trim();

    createEffect(() => {
        if (el && document.activeElement !== el) {
            el.innerText = props.value;
        }
    });

    return (
        <span
            ref={(e: HTMLElement) => (el = e)}
            contentEditable
            aria-placeholder={props.placeholder}
            class={`${props.class ?? ""} ${props.value.trim() === "" ? "placeholder" : ""}`}
            onKeyDown={(e: KeyboardEvent) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).blur();
                }
            }}
            onBlur={(e) => {
                const newText = sanitize((e.currentTarget as HTMLElement).innerText);
                if (newText !== props.value) {
                    props.onChange(newText);
                }
            }}
        />
    );
}
