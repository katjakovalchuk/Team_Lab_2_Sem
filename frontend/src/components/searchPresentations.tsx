import styles from "../scss/editor.module.scss";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";

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


export default function SearchPresentations() {
    const [name, setName] = useState("");
    const [presentationNames, setPresentationNames] = useState([]);
    const port = process.env.NEXT_PUBLIC_API_PORT || "80";
    console.log(presentationNames);

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const response = await fetch(`${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1/presentations`,
            {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
            }
        );
        if (response.status === 404) {
            alert("Sorry, something went wrong.\nCould not look up the presentations from the server.")
            return;
        }
        const result = await response.json();
        setPresentationNames(result);
    }

    return (
        <>
            <div className={styles.editorBox}>
                <h1>
                    Search For Presentations
                </h1>
                <form className={styles.inputBox} onSubmit={handleSubmit}>
                    <TextInput placeholder="Presentation Name" id="presName" name="presName" required={true} updateval={setName} value="" />
                    <input type="submit" style={{ display: "none" }} />
                </form>
                <div className={styles.vertical}>
                    {presentationNames.map(name =>
                        <a href={`/presentations/${name}/edit`} className={styles.presentationLink}>
                            <FaEdit />
                            <span>
                                {name}
                            </span>
                        </a>)}
                </div>
            </div>
        </>
    )
}
