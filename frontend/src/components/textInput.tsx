import styles from "../scss/editor.module.scss";

interface InputProps {
    placeholder: string;
    id: string;
    name: string;
    required: boolean;
};

export default function TextInput(props: InputProps) {
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <input type="input" className={styles.textInput} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}
