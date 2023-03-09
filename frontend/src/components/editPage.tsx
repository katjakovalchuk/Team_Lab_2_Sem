import styles from "../scss/editor.module.scss";
import TextInput from "./textInput";
import useScript from "./useScript";

export default function Editor(props) {
    return (
        <>
            <div className={styles.sideVew}>
                <div className={styles.editorBox}>

                </div>

                <div className="reveal">
                    <div className="slides">
                    </div>
                </div>
            </div>
        </>
    )
}
