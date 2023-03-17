import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { TextInput, } from "./textInput";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus, FaMinus, FaSave } from "react-icons/fa"
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import "reveal.js/dist/theme/moon.css";
import "reveal.js/plugin/highlight/monokai.css";

function ToSection(obj) {
    switch (obj.type) {
        case "text":
            return <span key={obj.name}>{obj.content}</span>

        case "code":
            return (
                <pre key={obj.name}>
                    <code data-line-numbers="" data-trim="" data-noescape="">
                        {obj.content}
                    </code>
                </pre>
            )

        case "img":
            return <img key={obj.name} src={obj.content} />

        case "iframe":
            return <iframe key={obj.name} allowFullScreen src={obj.content} />
    }
    return "";
}

function ToPresentation(obj) {
    return obj.map((slide) => {
        // This is not pretty. Too bad!
        if (slide.content.some((x) => x.type === "markdown")) {
            return <section data-markdown="" key={slide.name} data-background-color={slide.background ? slide.background : "var(--nav-color)"}>
                {slide.content[0].content}
            </section>
        }

        if (slide.content.some((x) => x.type === "other")) {
            return <section data-markdown="" key={slide.name} data-background-color={slide.background ? slide.background : "var(--nav-color)"} dangerouslySetInnerHTML={{ __html: slide.content[0].content }} />
        }

        return <section key={slide.name} data-background-color={slide.background ? slide.background : "var(--nav-color)"}>
            {slide.content.map(ToSection)}
        </section>
    })
}

export default function Editor(props) {
    const [presentationName, updatePresentationName] = useState("Presentation");
    const [slides, setSlides] = useState(
        [
            {
                name: "Slide 1",
                background: "#190e21",
                content: [
                    {
                        name: "example_text",
                        type: "text",
                        content: "This is an example slide",
                    },
                ],
            },
            {
                name: "Slide 2",
                background: "#190e21",
                content: [
                    {
                        name: "image",
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    }
                ],
            }
        ]
    );
    const [slideIdx, setSlideIdx] = useState(0);

    const SanitizeSlides = () => {
        let curSlides = slides;
        curSlides.forEach((slide, idx) => {
            slide.content.forEach((slideItem, slideItemIdx) => {
                if (slideItem.type === "markdown" || slideItem.type === "other") {
                    curSlides[idx].content = [curSlides[idx].content[slideItemIdx]];
                }
            })
        })
        setSlides([...curSlides]);
    }

    const updateElementContent = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].content = val;
            setSlides([...curSlides]);
            SanitizeSlides();
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].type = val;
            setSlides([...curSlides]);
            SanitizeSlides();
        }
        return updateFn;
    }

    const updateElementName = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].name = val;
            setSlides([...curSlides]);
            SanitizeSlides();
        }
        return updateFn;
    }

    const removeComponent = (index) => {
        let curSlides = slides;
        const updateFn = (_) => {
            delete curSlides[slideIdx].content[index];
            setSlides([...curSlides]);
            SanitizeSlides();
        }
        return updateFn;
    }

    const removeSlide = () => {
        let curSlides = slides;
        if (curSlides.length > 1) {
            curSlides.splice(slideIdx, 1);
            if (slideIdx + 1 > curSlides.length)
                setSlideIdx(slideIdx - 1);
        }
        setSlides([...curSlides]);
        SanitizeSlides();
    }

    const updateColor = (val) => {
        let curSlides = slides;
        curSlides[slideIdx].background = val;
        setSlides([...curSlides])
        SanitizeSlides();
    }

    const savePresentation = async () => {
        let presentationObject = {
            "name": presentationName,
            "slides": slides
        };
        const response = await fetch(`/presentations/${presentationName}/save`,
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify(presentationObject)
            }
        );
        // const result = await response.json();
        if (response.status === 404) {
            alert("Sorry, something went wrong.\nCould not save your presentation.")
            return;
        }
        console.log(response);
    }

    useEffect(() => {
        // const headers = { "Content-type": "application/json" };
        // fetch(`${window.location.origin}:8132/api/presentations/${props.presentationId}`, { headers })
        //     .then(resp => resp.json())
        //     .then(data => setSlides(data["slides"]))
        //             const clientSideInitialization = async () => {
        // load modules in browser
        const clientSideInitialization = async () => {
            // load modules in browser
            const Reveal = await (await import("reveal.js")).default;
            const Markdown = await (await import("reveal.js/plugin/markdown/markdown.esm")).default;
            const Highlight = await (await import("reveal.js/plugin/highlight/highlight.esm")).default;
            const deck = new Reveal({
                plugins: [Markdown, Highlight],
                embedded: true,
                hash: true
            })
            deck.initialize()
            setInterval(() => {
                deck.sync()
            }
                , 200)
        }
        clientSideInitialization();
    }, [])

    return (
        <>
            <div className={styles.vertical}>
                <div className={styles.arrows}>
                    <FaArrowLeft onClick={() => {
                        if (slideIdx - 1 >= 0)
                            setSlideIdx(slideIdx - 1);
                    }
                    } />
                    <FaArrowRight onClick={() => {
                        if ((slideIdx + 1) == slides.length) {
                            let curSlides = slides;
                            curSlides.push(
                                {
                                    name: `Slide ${curSlides.length + 1}`,
                                    background: "#190e21",
                                    content: [
                                        {
                                            name: `example_text${curSlides.length + 1}`,
                                            type: "text",
                                            content: "This is an example slide",
                                        },
                                    ],
                                }
                            )
                            setSlides(curSlides);
                        }
                        setSlideIdx((slideIdx + 1) % slides.length)
                    }
                    } />
                    <FaPlus onClick={() => {
                        let curSlides = slides;
                        curSlides[slideIdx].content.push(
                            {
                                name: `New component`,
                                type: "img",
                                content: "https://picsum.photos/200/300",
                            }
                        )
                        setSlides([...curSlides]);
                        setSlideIdx(slideIdx);
                        SanitizeSlides();
                    }} />
                    <FaMinus onClick={removeSlide} />
                    <FaSave onClick={savePresentation} />
                </div>
                <div className={styles.editorBox}>
                    <TextInput id={`presentation_name`} placeholder={"Presentation Name"} required={false} value={presentationName} name={presentationName} updateval={updatePresentationName} />
                    <TextInput id={`background_color`} placeholder={"Slide Background"} required={false} value={slides[slideIdx].background} name={`${presentationName}_color`} updateval={updateColor} />
                </div>
                <h2>{slides[slideIdx].name}</h2>
                {
                    Object.entries(slides[slideIdx].content).map(
                        v => <ElementEditor key={`${v[1].name}_${v[0]}`} type={v[1].type} id={v[1].name} name={v[1].name} required={true} value={v[1].content} updateContent={updateElementContent(v[0])} updateName={updateElementName(v[0])} updateType={updateElementType(v[0])} removeElement={removeComponent(v[0])} />
                    )
                }
                <div className={["reveal", styles.presentation].join(" ")}>
                    <div className="slides">
                        {
                            ToPresentation(slides)
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
