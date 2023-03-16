import styles from "../scss/editor.module.scss";
import { useRef } from "react";

interface InputProps {
    placeholder: string;
    id: string;
    name: string;
    required: boolean;
    value: string;
    updateval: (val: string) => void;
};

export function TextInput(props: InputProps) {
    const updateVal = () => {
        let elem: any = document.getElementById(props.id);
        if (elem !== null)
            props.updateval(elem.value);
    }
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <input type="input" className={styles.textInput} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} onBlur={updateVal} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}

export function TextArea(props: InputProps) {
    const updateVal = () => {
        let elem: any = document.getElementById(props.id);
        if (elem !== null)
            props.updateval(elem.value);
    }
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <textarea className={styles.textBox} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} onBlur={updateVal} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}

export function Select(props: InputProps) {
    const updateVal = () => {
        let elem: any = document.getElementById(props.id);
        if (elem !== null)
            props.updateval(elem.value);
    }
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <select className={styles.selectInput} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} onChange={updateVal}>
                    <option value="img">Image</option>
                    <option value="iframe">Iframe</option>
                    <option value="text">Plain Text</option>
                    <option value="code">Code</option>
                    <option value="markdown">Markdown</option>
                    <option value="other">HTML</option>
                </select>
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )

}

export default TextInput;
