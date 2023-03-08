import styles from "../scss/editor.module.scss";
import TextInput from "./textInput";

export default function NewPersentationPage() {
    return (
        <>
            <div className={styles.editorBox}>
                <h1>
                    Create New Presentation
                </h1>
                <form className={styles.inputBox} action="/api/new/">
                    <TextInput placeholder="Presentation Name" is="presName" name="presName" />
                    <input type="submit" style={{ display: "none" }} />
                </form>
            </div>
        </>
    )
}
