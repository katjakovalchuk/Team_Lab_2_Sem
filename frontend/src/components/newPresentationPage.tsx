import styles from "../scss/editor.module.scss";

export default function NewPersentationPage() {
    return (
        <>
            <div className={styles.editorBox}>
                <h1>
                    Create New Presentation
                </h1>
                <form className={styles.inputBox} action="/api/new/">
                    <input type="input" className={styles.textInput} placeholder="Presentation Name" name="presName" id="presName" required />
                    <label htmlFor="presName" className={styles.label}>Presentation Name</label>
                </form>
            </div>
        </>
    )
}
