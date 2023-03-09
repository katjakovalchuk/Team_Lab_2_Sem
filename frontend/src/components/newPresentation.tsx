import styles from "../scss/newPres.module.scss";
import TextInput from "./textInput";

export default function NewPresentation() {
    return (
        <>
            <div className={styles.editorBox}>
                <h1>
                    Create New Presentation
                </h1>
                <form className={styles.inputBox} action="/api/new/">
                    <TextInput placeholder="Presentation Name" id="presName" name="presName" required={true} />
                    <input type="submit" style={{ display: "none" }} />
                </form>
            </div>
        </>
    )
}
