import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { TextInput, } from "./textInput";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus, FaMinus, FaSave } from "react-icons/fa"
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import "reveal.js/plugin/highlight/monokai.css";

function ToSection(obj) {
    switch (obj.type) {
        case "markdown":
        case "text":
            return `<span key=${obj.name} ${obj.attributes}>${obj.content}</span>`

        case "code":
            return (
                `<pre key=${obj.name}>
                    <code
                        data-line-numbers="1"
                        data-trim
                        ${obj.attributes}
                        data-noescape>
                        ${obj.content}
                    </code>
                </pre>`
            )

        case "img":
            return `<img
                ${obj.attributes}
                key=${obj.name}
                src=${obj.content} />`

        case "iframe":
            return `<iframe
                ${obj.attributes}
                key=${obj.name}
                allowFullScreen
                src=${obj.content} />`
    }
    return "";
}

function ToPresentation(obj) {
    return Object.entries(obj).map((slideObject) => {
        const slide = slideObject[1];
        console.log(slide);
        // This is not pretty. Too bad!
        if (slide.content.some((x) => x.type === "other")) {
            return <section
                key={slide.slide_id}
                data-background-color={
                    slide.background ?
                        slide.background :
                        "var(--nav-color)"
                }
                dangerouslySetInnerHTML={{ __html: slide.content[0].content }} />
        }

        return <section key={slide.name} data-background-color={slide.background ? slide.background : "var(--nav-color)"} dangerouslySetInnerHTML={{ __html: slide.content.map(ToSection).join("") }} />
    })
}

export default function Editor() {
    const port = process.env.NEXT_PUBLIC_API_PORT || "80";
    const [presentationName, updatePresentationName] = useState("presentation1");
    const [slides, setSlides] = useState([
        {
            name: "Slide 1",
            background: "#2e3440",
            content: [{
                name: "example_text",
                type: "text",
                attributes: "",
                content: "This is an example slide"
            }]
        }
    ]);
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

    const updateElementContent = async (element) => {
        let curSlides = slides;
        const updateFn = async (val) => {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            curSlides[slideIdx].content[element].content = val;
            setSlides([...curSlides]);
            SanitizeSlides();
            try {
                const response = await fetch(`${baseURL}/${presentationName}/${element}/update_content`,
                    {
                        mode: "cors",
                        cache: "default",
                        method: "PUT",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            "Accept": "application/json",
                            "Content-type": "application/json"
                        },
                        body: { content: val }
                    }
                );

                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                }
            } catch {
                alert("Sorry, something went wrong.\nCould not save your presentation.")
            }

        }
        return updateFn;
    }

    const updateElementType = async (element) => {
        let curSlides = slides;
        const updateFn = async (val) => {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            curSlides[slideIdx].content[element].type = val;
            setSlides([...curSlides]);
            SanitizeSlides();
            try {
                const response = await fetch(`${baseURL}/${presentationName}/${slideIdx}/${element}/update_type`,
                    {
                        mode: "cors",
                        cache: "default",
                        method: "PUT",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            "Accept": "application/json",
                            "Content-type": "application/json"
                        },
                        body: { type: val }
                    }
                );

                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                }
            } catch {
                alert("Sorry, something went wrong.\nCould not save your presentation.")

            }
        }
        return updateFn;
    }

    const updateElementAttributes = async (element) => {
        let curSlides = slides;
        const updateFn = async (val) => {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            curSlides[slideIdx].content[element].attributes = val;
            setSlides([...curSlides]);
            SanitizeSlides();
            try {
                const response = await fetch(`${baseURL}/${presentationName}/${slideIdx}/${element}/update_attributes`,
                    {
                        mode: "cors",
                        cache: "default",
                        method: "PUT",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            "Accept": "application/json",
                            "Content-type": "application/json"
                        },
                        body: { name: val }
                    }
                );

                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                }
            } catch {
                alert("Sorry, something went wrong.\nCould not save your presentation.")

            }
        }
        return updateFn;
    }

    const removeComponent = (index) => {
        let curSlides = slides;
        const updateFn = async (_) => {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            delete curSlides[slideIdx].content[index];
            setSlides([...curSlides]);
            SanitizeSlides();
            try {
                const response = await fetch(`${baseURL}/${presentationName}/${slideIdx}/${index}/remove`,
                    {
                        mode: "cors",
                        cache: "default",
                        method: "PUT",
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            "Accept": "application/json",
                            "Content-type": "application/json"
                        },
                        body: { name: val }
                    }
                );

                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                }
            } catch {
                alert("Sorry, something went wrong.\nCould not save your presentation.")

            }
        }
        return updateFn;
    }

    const removeSlide = async () => {
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        let curSlides = slides;
        if (curSlides.length > 1) {
            curSlides.splice(slideIdx, 1);
            if (slideIdx + 1 > curSlides.length)
                setSlideIdx(slideIdx - 1);

        }
        setSlides([...curSlides]);
        SanitizeSlides();
        try {
            const response = await fetch(`${baseURL}/${presentationName}/${slideIdx}/remove`,
                {
                    mode: "cors",
                    cache: "default",
                    method: "PUT",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                }
            );

            if (response.status !== 200) {
                alert("Sorry, something went wrong.\nCould not save your presentation.")
            }
        } catch {
            alert("Sorry, something went wrong.\nCould not save your presentation.")
        }
    }

    const updateColor = async (val) => {
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        let curSlides = slides;
        curSlides[slideIdx].background = val;
        setSlides([...curSlides])
        SanitizeSlides();
        try {
            const response = await fetch(`${baseURL}/${presentationName}/${slideIdx}/set_color`,
                {
                    mode: "cors",
                    cache: "default",
                    method: "PUT",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                    body: { color: val }
                }
            );

            if (response.status !== 200) {
                alert("Sorry, something went wrong.\nCould not save your presentation.")
            }
        } catch {
            alert("Sorry, something went wrong.\nCould not save your presentation.")

        }
    }

    const savePresentation = async () => {
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        let presentationObject = {
            "name": presentationName,
            "slides": slides
        };
        try {
            const response = await fetch(`${baseURL}/${presentationName}/save`,
                {
                    mode: "cors",
                    cache: "default",
                    method: "POST",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(presentationObject)
                }
            );

            if (response.status !== 200) {
                alert("Sorry, something went wrong.\nCould not save your presentation.")
                return;
            }
        } catch {
            alert("Sorry, something went wrong.\nCould not save your presentation.")

        }
    }

    useEffect(() => {
        let splitPath = window.location.href.split("/");
        const pname = splitPath[splitPath.length - 2];
        updatePresentationName(pname);
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        try {
            const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
            fetch(`${baseURL}/${presentationName}`, { headers: headers, mode: 'cors' })
                .then(resp => resp.json())
                .then(data => setSlides(Object.values(data["slides"])))
        } catch {
            alert("Sorry, could not fetch the presentation data")
        }
        // load modules in browser
        const clientSideInitialization = async () => {
            // load modules in browser
            const Reveal = await (await import("reveal.js")).default;
            const Markdown = await (await import("reveal.js/plugin/markdown/markdown.esm.js")).default;
            const Highlight = await (await import("reveal.js/plugin/highlight/highlight.esm.js")).default;
            let deck = new Reveal({
                plugins: [Markdown, Highlight],
                embedded: true,
                hash: true
            })
            deck.initialize()
            setInterval(() => {
                deck.sync();
            }, 500)
        }
        document.onload = clientSideInitialization;
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
                                    background: "#2e3440",
                                    content: [
                                        {
                                            name: `example_text${curSlides.length + 1}`,
                                            type: "text",
                                            attributes: "",
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
                    <FaPlus onClick={async () => {
                        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
                        let curSlides = slides;
                        console.log(curSlides);
                        curSlides[slideIdx].content.push(
                            {
                                name: `New component`,
                                type: "img",
                                content: "https://picsum.photos/1920/1080",
                            }
                        )
                        setSlides([...curSlides]);
                        setSlideIdx(slideIdx);
                        SanitizeSlides();
                        try {
                            const response = await fetch(`${baseURL}/${presentationName}`,
                                {
                                    mode: "cors",
                                    cache: "default",
                                    method: "POST",
                                    headers: {
                                        'Access-Control-Allow-Origin': '*',
                                        "Accept": "application/json",
                                        "Content-type": "application/json"
                                    },
                                }
                            );

                            if (response.status !== 200) {
                                alert("Sorry, something went wrong.\nCould not save your presentation.")
                                return;
                            }
                        } catch {
                            alert("Sorry, something went wrong.\nCould not save your presentation.")

                        }
                    }} />
                    <FaMinus onClick={removeSlide} />
                    <FaSave onClick={savePresentation} />
                </div>
                <div className={styles.editorBox}>
                    <h2>{presentationName}</h2>
                    <TextInput
                        id={`background_color`}
                        placeholder={"Slide Background"}
                        required={false}
                        value={slides[slideIdx].background}
                        name={`${presentationName}_color`}
                        updateval={updateColor} />
                </div>
                <h2>{slides[slideIdx].name}</h2>
                {
                    slides.length > 0 && Object.entries(slides[slideIdx].content).map(
                        v => <ElementEditor
                            key={`${v[1].name}_${v[0]}`}
                            type={v[1].type}
                            id={v[1].name}
                            name={v[1].name}
                            required={true}
                            value={v[1].content}
                            attrs={`${v[1].name}_attrs`}
                            updateContent={updateElementContent(v[0])}
                            updateType={updateElementType(v[0])}
                            removeElement={removeComponent(v[0])}
                            updateAttrs={updateElementAttributes(v[0])} />
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
