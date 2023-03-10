import styles from "../scss/editor.module.scss";
import TextInput from "./textInput";
import useScript from "./useScript";
import { useEffect, useState } from "react";

interface EditorProps {
    presentationId: string;

};

interface JSONSlide {
    type: string;
    content: string;
}

function ToComponent(obj: JSONSlide) {
    // switch(obj.type) {
    //     case "markdown":
    //     case "text":
    // }
    return <></>
}

export default function Editor(props: EditorProps) {
    const [slides, setSlides] = useState([]);
    const [sideIdx, setSlideIdx] = useState([0]);

    useEffect(() => {
        const headers = { "Content-type": "application/json" };
        fetch(`/api/presentations/${props.presentationId}`, { headers })
            .then(resp => resp.json())
            .then(data => setSlides(data["slides"]))
    }, [])

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
