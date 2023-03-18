import styles from "../scss/editor.module.scss";
import { useState } from "react";

function TextInput(props: any) {
    const updateVal = () => {
        let elem: any = document.getElementById(props.id);
        if (elem !== null)
            props.updateval(elem.value);
    }
    return (
        <>
            <div className={[styles.inputBox].join(" ")}>
                <input type="input" className={styles.textInput} placeholder={props.placeholder} name={props.name} id={props.id} required={props.required} defaultValue={props.value} onChange={updateVal} />
                <label htmlFor={props.id} className={styles.label}>{props.placeholder}</label>
            </div>
        </>
    )
}


export default function NewPresentation() {
    const [name, setName] = useState("");

    const handleSubmit = (event: any) => {
        event.preventDefault();
        window.location.href = `/presentations/${name}/edit`;
    }

    return (
        <>
            <div className={styles.editorBox}>
                <h1>
                    Create New Presentation
                </h1>
                <form className={styles.inputBox} onSubmit={handleSubmit}>
                    <TextInput placeholder="Presentation Name" id="presName" name="presName" required={true} updateval={setName} value="" />
                    <input type="submit" style={{ display: "none" }} />
                </form>
            </div>
        </>
    )
}
