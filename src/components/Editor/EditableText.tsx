// EditableText
import { JSX } from "solid-js";

interface EditableTextProps {
    value: string;
    placeholder?: string;
    onChange: (newValue: string) => void;
    tag?: keyof JSX.IntrinsicElements; // e.g., "h2", "h4", "h5"
    class?: string;
}

export default function EditableText(props: EditableTextProps) {
    const Tag = props.tag || "span";

    const sanitize = (text: string) => text.replace(/[\r\n]+/g, "").trim();

    return (
        <Tag
            contentEditable
            class={`${props.class ?? ""} ${props.value.trim() === "" ? "placeholder" : ""}`}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            }}
            onBlur={(e) => {
                const newText = sanitize(e.currentTarget.innerText);
                props.onChange(newText);
            }}
        >
            {props.value}
        </Tag>
    );
}
