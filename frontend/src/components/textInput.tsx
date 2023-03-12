import styles from "../scss/editor.module.scss";

interface InputProps {
    placeholder: string;
    id: string;
    name: string;
    required: boolean;
    value: string;
};

export function TextInput(props: InputProps) {
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <input type="input" className={styles.textInput} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}
export function TextArea(props: InputProps) {
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <textarea className={styles.textBox} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}

export default TextInput;
