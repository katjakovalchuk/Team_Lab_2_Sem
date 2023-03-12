import styles from "../scss/editor.module.scss";
import { useState } from "react";
import { TextInput, TextArea } from "./textInput";

export default function ElementEditor(props) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <div className={styles.editorBox}>
            <div className={styles.accordionTitle} onClick={() => setCollapsed(!collapsed)}>
                <h3>{props.id}</h3>
                <div>{collapsed ? "+" : "-"}</div>
            </div>
            {
                !collapsed && (
                    <>
                        <TextInput id={props.id} placeholder={props.name} required={props.required} value={props.name} name={props.name} />
                        <TextArea id={props.id} placeholder={props.type} required={props.required} value={props.value} name={props.name} />
                    </>
                )
            }

        </div >
    )
}
