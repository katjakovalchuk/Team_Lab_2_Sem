import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { useEffect, useState } from "react";

export default function Editor(props) {
    const [slides, setSlides] = useState(
        [
            {
                content: [
                    {
                        name: "page_one",
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    },
                    {
                        name: "page_two",
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    }
                ],
            }
        ]
    );
    const [slideIdx, setSlideIdx] = useState(0);

    const updateElementContent = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].content = val;
            console.log(val);
            setSlides({ ...curSlides });
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].type = val;
            console.log(val);
            setSlides({ ...curSlides });
        }
        return updateFn;
    }

    const updateElementName = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].name = val;
            setSlides({ ...curSlides });
        }
        return updateFn;
    }

    useEffect(() => {
        // const headers = { "Content-type": "application/json" };
        // fetch(`/api/presentations/${props.presentationId}`, { headers })
        //     .then(resp => resp.json())
        //     .then(data => setSlides(data["slides"]))

    }, [])

    return (
        <>
            <div className={styles.vertical} id="slide_editor">
                {
                    Object.entries(slides[slideIdx].content).map(
                        v => <ElementEditor key={v[1].name} type={v[1].type} id={v[1].name} name={v[1].name} required={true} value={v[1].content} updateContent={updateElementContent(v[0])} updateName={updateElementName(v[0])} updateType={updateElementType(v[0])} />
                    )
                }
            </div>
        </>
    )
}
