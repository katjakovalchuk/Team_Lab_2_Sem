import styles from "../scss/editor.module.scss";
import TextInput from "./textInput";
import { useEffect, useState } from "react";

function ToSection(obj) {
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

export default function Editor(props) {
    const [slides, setSlides] = useState(
        [
            {
                content: {
                    page_one: [
                        {
                            type: "text",
                            content: "# Hiya there! Meesa an empty slide!",
                            data_transition: "",
                            bg: "#1f2a31"
                        }
                    ]
                },
                dataTransition: "",
                isMarkdown: true,
                bg: "1f2a31"
            }
        ]
    );
    const [slideIdx, setSlideIdx] = useState(0);

    useEffect(() => {
        // const headers = { "Content-type": "application/json" };
        // fetch(`/api/presentations/${props.presentationId}`, { headers })
        //     .then(resp => resp.json())
        //     .then(data => setSlides(data["slides"]))

        const clientSideInitialization = async () => {
            // load modules in browser
            const Reveal = await (await import("reveal.js")).default
            const Markdown = await (await import("reveal.js/plugin/markdown/markdown.esm")).default
            const deck = new Reveal({
                plugins: [Markdown]
            })
            deck.initialize()
        }
        clientSideInitialization()
    }, [])

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
                                    {Object.entries(slides[slideIdx].content).map(v => { return ToSection(v[1]) })}
                                </section>) :
                                (<section data-background-color={slides[slideIdx].bg} data-transition={slides[slideIdx].dataTransition}>
                                    {Object.entries(slides[slideIdx].content).map(v => { return ToSection(v[1]) })}
                                </section>)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
