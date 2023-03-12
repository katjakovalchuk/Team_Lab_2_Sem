import styles from "../scss/editor.module.scss";
import { useState } from "react";
import { TextInput, TextArea } from "./textInput";

export default function ElementEditor(props) {
    const [collapsed, setCollapsed] = useState(true);
    return (
        <div className={styles.editorBox}>
            <div className={styles.accordionTitle} onClick={() => setCollapsed(!collapsed)}>
                <span><h3>{props.id + (collapsed ? "  +" : "  -")}</h3></span>
            </div>
            {
                !collapsed && (
                    <>
                        <TextInput id={`${props.id}_name`} placeholder={"Name"} required={props.required} value={props.name} name={props.name} updateval={props.updateName} />
                        <TextInput id={`${props.id}_type`} placeholder={"Type"} required={props.required} value={props.type} name={props.type} updateval={props.updateType} />
                        <TextArea id={`${props.id}_content`} placeholder={props.type} required={props.required} value={props.value} name={props.name} updateval={props.updateContent} />
                    </>
                )
            }

        </div >
    )
}
