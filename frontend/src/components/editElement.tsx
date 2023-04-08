import styles from "../scss/editor.module.scss";
import { useState } from "react";
import { TextInput, TextArea, Select } from "./textInput";
import { FaTrash } from "react-icons/fa";

export default function ElementEditor(props: any) {
    const [collapsed, setCollapsed] = useState(true);
    let textAreaPlaceholder = (props.type == "img" || props.type == "iframe") ?
        "src" :
        props.type;
    console.log(props);
    return (
        <div className={styles.editorBox}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                <div className={styles.accordionTitle} onClick={() => setCollapsed(!collapsed)}>
                    <span><h3>{props.id + (collapsed ? "  +" : "  -")}</h3></span>
                </div>
                <FaTrash
                    className={styles.deleteIcon}
                    onClick={props.removeElement}
                />
            </div>
            <div className={styles.accordionContent}>
                {
                    !collapsed && (
                        <>
                            <TextInput
                                id={`${props.id}_attrs`}
                                placeholder={"Additional Attributes"}
                                required={props.required}
                                value=""
                                name={props.attrs}
                                updateval={props.updateAttrs} />
                            <Select
                                id={`${props.id}_type`}
                                placeholder={"Type"}
                                required={props.required}
                                value={props.type}
                                name={props.type}
                                updateval={props.updateType} />
                            <TextArea
                                id={`${props.id}_content`}
                                placeholder={textAreaPlaceholder}
                                required={props.required}
                                value={props.value}
                                name={props.name}
                                updateval={props.updateContent} />
                        </>
                    )
                }
            </div >
        </div>
    )
}
