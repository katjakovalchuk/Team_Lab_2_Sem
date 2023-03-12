import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { useEffect, useState } from "react";

export default function Editor(props) {
    const [slides, setSlides] = useState(
        [
            {
                content: {
                    page_one: {
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    },
                    page_two: {
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    }
                },
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
                {Object.entries(slides[slideIdx].content).map(
                    v => {
                        return <ElementEditor key={v[0]} id={v[0]} name={v[0]} required={true} type={v[1].type} value={v[1].content} />;
                    }
                )
                }
            </div>
        </>
    )
}
