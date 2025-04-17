import { createEffect } from "solid-js";

interface EditableTextProps {
    value: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    class?: string;
}

export default function EditableText(props: EditableTextProps) {
    let el: HTMLElement;
    let originalValue = props.value;

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
            onFocus={() => {
                originalValue = props.value;
            }}
            onKeyDown={(e: KeyboardEvent) => {
                const target = e.currentTarget as HTMLElement;
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.stopPropagation();
                    target.blur();
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    e.stopPropagation();
                    target.innerText = originalValue;
                    target.blur(); // triggers onBlur, but since value is unchanged, no `onChange` fires
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
