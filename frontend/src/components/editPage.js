import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { TextInput, } from "./textInput";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus, FaMinus, FaRedo } from "react-icons/fa"
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import "reveal.js/plugin/highlight/monokai.css";

function ToSection(obj, slideIdx) {
    switch (obj.type) {
        case "markdown":
        case "text":
            return `<span key="slide_${slideIdx}_object_${obj.object_id}" ${obj.attributes}>${obj.value}</span>`

        case "code":
            return (
                `<pre key=${obj.obejct_id}>
                    <code
                        data-line-numbers="1"
                        data-trim
                        ${obj.attributes}
                        data-noescape>
                        ${obj.value}
                    </code>
                </pre>`
            )

        case "img":
            return `<img
                ${obj.attributes}
                key=${obj.obejct_id}
                src=${obj.value} />`

        case "iframe":
            return `<iframe
                ${obj.attributes}
                key=${obj.object_id}
                allowFullScreen
                src=${obj.value} />`
    }
    return obj.value;
}

function ToPresentation(obj) {
    return Object.entries(obj).map((slideObject) => {
        let slide = slideObject[1];
        if (slide.content.map === undefined) {
            slide.content = []
        }
        // This is not pretty. Too bad!
        return <section
            key={`slide_${slide.slide_id}`}
            data-background-color={slide.background ? slide.background : "var(--nav-color)"}
            dangerouslySetInnerHTML={{ __html: slide.content.map((v) => { return ToSection(v, slide.slide_id) }).join("") }} />
    })
}

export default function Editor() {
    const port = process.env.NEXT_PUBLIC_API_PORT || "80";
    const [presentationName, updatePresentationName] = useState("");
    const [slides, setSlides] = useState([
        {
            slide_id: 1,
            background: "#2e3440",
            content: [{
                object_id: 1,
                type: "text",
                attributes: "",
                value: "This is an example slide"
            }]
        }
    ]);
    const [slideIdx, setSlideIdx] = useState(0);

    const fetchPresentation = async () => {
        try {
            let splitPath = window.location.href.split("/");
            const pname = splitPath[4];
            updatePresentationName(pname);
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
            let resp = await fetch(`${baseURL}/${pname}`, { headers: headers, mode: 'cors', method: "GET" });

            if (resp.status !== 200) {
                await fetch(`${baseURL}/${pname}`, { method: "POST", headers: headers, mode: 'cors' });
                resp = await fetch(`${baseURL}/${pname}`, { headers: headers, mode: 'cors', method: "GET" });
            }

            const data = await resp.json();
            if (data.slides) {
                let presSlides = JSON.parse(JSON.stringify(data.slides));
                presSlides.sort(v => v.slide_id);
                setSlides(presSlides);
            } else {
                setSlides([
                    {
                        slide_id: 1,
                        background: "#2e3440",
                        content: []
                    }
                ]);
            }
        } catch {
            console.log("Wah");
        }
    }

    const updateSlide = async () => {
        try {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            const slideResponse = await fetch(`${baseURL}/${presentationName}/update_slide`,
                {
                    method: "PUT",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(slides[slideIdx]),
                }
            );
            const response = await slideResponse.json();
            if (response.status !== 200) {
                alert("Sorry, something went wrong.\nCould not save your presentation.")
            }
        } catch {
            console.log("Sorry, could nto update slide");
        }
        await fetchPresentation();
    }

    const updateElementContent = (element) => {
        let cur_slides = [...slides];
        const updateFn = async (val) => {
            cur_slides[slideIdx].content[element].value = val;
            setSlides([...cur_slides]);
            await updateSlide();
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let cur_slides = [...slides];
        const updateFn = async (val) => {
            cur_slides[slideIdx].content[element]["type"] = val;
            setSlides([...cur_slides]);
            await updateSlide();
        }
        return updateFn;
    }

    const updateElementAttributes = (element) => {
        let cur_slides = [...slides];
        const updateFn = async (val) => {
            cur_slides[slideIdx].content[element]["attributes"] = val;
            setSlides([...cur_slides]);
            await updateSlide();
        }
        return updateFn;
    }

    const removeComponent = (index) => {
        const updateFn = async (_) => {
            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
            await fetch(`${baseURL}/${presentationName}/${slides[slideIdx].slide_id}/remove_object?object_id=${slides[slideIdx].content[index].object_id}`,
                {
                    cache: "default",
                    method: "DELETE",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                }
            )
                .then(response => {
                    if (response.status !== 200) {
                        alert("Sorry, something went wrong.\nCould not save your presentation.")
                        return;
                    }
                });

            await fetchPresentation();
        }
        return updateFn;
    }

    const removeSlide = async () => {
        if (slides.length == 1)
            return;
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        try {
            await fetch(`${baseURL}/${presentationName}/remove_slide?slide_id=${slides[slideIdx].slide_id}`,
                {
                    cache: "default",
                    method: "DELETE",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        "Accept": "application/json",
                        "Content-type": "application/json"
                    },
                }
            )
                .then(response => {
                    if (response.status !== 200) {
                        alert("Sorry, something went wrong.\nCould not save your presentation.")
                        return;
                    }
                });
        } catch {
            alert("Sorry, something went wrong.\nCould not save your presentation.")
        }
        await fetchPresentation();
    }

    const updateColor = async (val) => {
        let cur_slides = [...slides];
        cur_slides[slideIdx].background = val;
        setSlides([...cur_slides])
        await updateSlide();
        fetchPresentation();
    }
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
        }, 500);
        deck.addEventListener('ready', () => deck.slide(0))
    }
    useEffect(() => {
        fetchPresentation();
        // load modules in browser
        clientSideInitialization();
    }, [])

    return (
        <>
            <div className={styles.vertical}>
                <div className={styles.arrows}>
                    <FaArrowLeft onClick={async () => {

                        if (slideIdx - 1 >= 0) {
                            setSlideIdx(slideIdx - 1);
                        }
                    }
                    } />
                    <FaArrowRight onClick={async () => {
                        await fetchPresentation();
                        if ((slideIdx + 1) >= slides.length) {
                            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
                            const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
                            try {
                                const resp = await fetch(`${baseURL}/${presentationName}/add_slide`, { headers: headers, mode: 'cors', method: "POST" })

                                if (resp.status !== 200) {
                                    alert("Sorry, could not fetch the presentation data")
                                }
                            } catch {
                                alert("Sorry, could not fetch the presentation data")
                            }
                        }
                        await fetchPresentation();
                        setSlideIdx(slideIdx + 1);
                    }
                    } />
                    <FaMinus onClick={removeSlide} />
                    <FaRedo onClick={fetchPresentation} />
                </div>
                <div className={styles.editorBox}>
                    <h2>
                        Slide {slideIdx + 1}
                        <FaPlus onClick={async () => {
                            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
                            try {
                                const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
                                fetch(`${baseURL}/${presentationName}/${slides[slideIdx].slide_id}/add_object`, { headers: headers, mode: 'cors', method: "POST" })
                                    .catch(
                                        () => alert("Sorry, could not fetch the presentation data")
                                    );
                            } catch {
                                alert("Could not add slide. Sorry")
                            }
                            await fetchPresentation();
                        }} />
                    </h2>
                    <TextInput
                        id={`background_color`}
                        placeholder={"Slide Background"}
                        required={false}
                        value={slides[slideIdx].background}
                        name={`${presentationName}_color`}
                        updateval={updateColor} />
                </div>
                {
                    Object.entries([...slides[slideIdx].content]).map(
                        v => {
                            return (<ElementEditor
                                key={`slide_${slides[slideIdx].slide_id}_component_${v[1].object_id}`}
                                type={v[1].type}
                                id={v[1].type}
                                name={v[1].object_id}
                                required={true}
                                value={v[1].value}
                                attrs={`${v[1].slide_id}_attrs`}
                                updateContent={updateElementContent(v[0])}
                                updateType={updateElementType(v[0])}
                                removeElement={removeComponent(v[0])}
                                updateAttrs={updateElementAttributes(v[0])} />)
                        }
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
