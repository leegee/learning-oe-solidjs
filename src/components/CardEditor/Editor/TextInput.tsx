interface TextInputProps {
    label: string;
    value: string;
    multiline?: boolean;
    onInput: (e: InputEvent) => void;
    placeholder?: string;
    type?: string;
}

const TextInput = (props: TextInputProps) => {
    return (
        <div class="form-field">
            <label>{props.label}</label>
            {props.multiline
                ? <textarea
                    placeholder={props.placeholder}
                    value={props.value}
                    onInput={props.onInput}
                    class="text-input"
                ></textarea>
                : <input
                    placeholder={props.placeholder}
                    type={props.type || 'text'}
                    value={props.value}
                    onInput={props.onInput}
                    class="text-input"
                />
            }
        </div>
    );
};

export default TextInput;
