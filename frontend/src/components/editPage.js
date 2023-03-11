import styles from "../scss/editor.module.scss";
import { useEffect, useState } from "react";

export default function Editor(props) {
    const [slides, setSlides] = useState(
        [
            {
                content: {
                    page_one: {
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    }
                },
                dataTransition: "",
                isMarkdown: true,
                bg: "#fff"
            }
        ]
    );
    const [slideIdx, setSlideIdx] = useState(0);

    useEffect(() => {
        // const headers = { "Content-type": "application/json" };
        // fetch(`/api/presentations/${props.presentationId}`, { headers })
        //     .then(resp => resp.json())
        //     .then(data => setSlides(data["slides"]))

    }, [])

    return (
        <>
            <div className={styles.editorBox}>

            </div>
        </>
    )
}
