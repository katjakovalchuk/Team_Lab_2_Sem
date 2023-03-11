import styles from "../scss/editor.module.scss";
import TextInput from "./textInput";
import Reveal from "reveal.js";
import Markdown from "plugin/markdown/markdown.esm.js"
import { useEffect, useState } from "react";

interface EditorProps {
    presentationId: string;

};

interface JSONSlide {
    type: string;
    content: string;
}

function ToSection(obj: JSONSlide) {
    switch (obj.type) {
        case "other":
        case "text":
            return obj.content

        case "code":
            return (
                <pre data-id="code">
                    <code>
                        {obj.content}
                    </code>
                </pre>
            )

        case "img":
            return <img src={obj.content} />

        case "iframe":
            return <iframe allowFullScreen src={obj.content} />

    }
    return "# Empty slide"
}

export default function Editor(props: EditorProps) {
    useEffect(() => {
        setTimeout(() => { Reveal.sync() }, 3000);
    }, []);

    const [slides, setSlides] = useState(
        [
            {
                content: [
                    {
                        type: "text",
                        content: "# Hiya there! Meesa an empty slide!",
                        data_transition: "",
                        bg: "#1f2a31"
                    }
                ],
                dataTransition: "",
                isMarkdown: true,
                bg: "1f2a31"
            }
        ]
    );
    const [slideIdx, setSlideIdx] = useState(0);

    useEffect(() => {
        const headers = { "Content-type": "application/json" };
        fetch(`/api/presentations/${props.presentationId}`, { headers })
            .then(resp => resp.json())
            .then(data => setSlides(data["slides"]))
    }, [])

    Reveal.initialize({
        plugins: [Markdown]
    });

    return (
        <>
            <div className={styles.sideVew}>
                <div className={styles.editorBox}>

                </div>

                <div className="reveal">
                    <div className="slides">
                        {
                            slides[slideIdx].isMarkdown ?
                                (<section data-markdown data-background-color={slides[slideIdx].bg} data-transition={slides[slideIdx].dataTransition}>
                                    {slides[slideIdx].content.map(ToSection)}
                                </section>) :
                                (<section data-background-color={slides[slideIdx].bg} data-transition={slides[slideIdx].dataTransition}>
                                    {slides[slideIdx].content.map(ToSection)}
                                </section>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
