import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { TextInput, } from "./textInput";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus, FaMinus, FaRedo } from "react-icons/fa"
import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import "reveal.js/plugin/highlight/monokai.css";

function ToSection(obj) {
    switch (obj.object_type) {
        case "markdown":
        case "text":
            return `<span key=${obj.object_id} ${obj.attributes}>${obj.content}</span>`

        case "code":
            return (
                `<pre key=${obj.obejct_id}>
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
                key=${obj.obejct_id}
                src=${obj.content} />`

        case "iframe":
            return `<iframe
                ${obj.attributes}
                key=${obj.object_id}
                allowFullScreen
                src=${obj.content} />`
    }
    return "";
}

function ToPresentation(obj) {
    return Object.entries(obj).map((slideObject) => {
        const slide = slideObject[1];
        // This is not pretty. Too bad!
        if (slide.content.some((x) => x !== null && x.object_type === "other")) {
            return <section
                key={slide.slide_id}
                data-background-color={
                    slide.background ?
                        slide.background :
                        "var(--nav-color)"
                }
                dangerouslySetInnerHTML={{ __html: slide.content[0].content }} />
        }

        return <section key={`slide_${slide.slide_id}`} data-background-color={slide.background ? slide.background : "var(--nav-color)"} dangerouslySetInnerHTML={{ __html: slide.content.map(ToSection).join("") }} />
    })
}

export default function Editor() {
    const port = process.env.NEXT_PUBLIC_API_PORT || "80";
    const [presentationName, updatePresentationName] = useState("");
    const [slides, setSlides] = useState([
        {
            slide_id: 0,
            background: "#2e3440",
            content: [{
                object_id: 0,
                object_type: "text",
                attributes: "",
                content: "This is an example slide"
            }]
        }
    ]);
    const [slideIdx, setSlideIdx] = useState(0);

    const updateSlide = () => {
        SanitizeSlides();
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        fetch(`${baseURL}/${presentationName}/update_slide`,
            {
                mode: "cors",
                cache: "default",
                method: "PUT",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ slide_id: slideIdx, ...slides[slideIdx] })
            }
        )
            .then(response => {
                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                }
            });

    }

    const SanitizeSlides = () => {
        let curSlides = slides;
        curSlides.forEach((slide, idx) => {
            slide.slide_id = idx;
            slide.content.forEach((slideItem, slideItemIdx) => {
                if (slideItem.object_type === "markdown" || slideItem.object_type === "other") {
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
            updateSlide();
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].object_type = val;
            setSlides([...curSlides]);
            SanitizeSlides();
            updateSlide();
        }
        return updateFn;
    }

    const updateElementAttributes = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].attributes = val;
            setSlides([...curSlides]);
            SanitizeSlides();
            updateSlide();
        }
        return updateFn;
    }

    const removeComponent = (index) => {
        let curSlides = slides;
        const updateFn = (_) => {
            curSlides[slideIdx].content.splice(index, 1);
            setSlides([...curSlides]);
            SanitizeSlides();
            updateSlide();
        }
        return updateFn;
    }

    const removeSlide = () => {
        if (slides.length == 1)
            return;
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        try {
            fetch(`${baseURL}/${presentationName}/remove_slide?slide_id=${slides[slideIdx].slide_id}`,
                {
                    mode: "cors",
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
                    let curSlides = slides;
                    curSlides.splice(slideIdx, 1);
                    if (slideIdx + 1 > curSlides.length) {
                        setSlideIdx(slideIdx - 1);
                    }
                    console.log(curSlides);
                    setSlides([...curSlides]);
                    SanitizeSlides();
                });
        } catch {
            alert("Sorry, something went wrong.\nCould not save your presentation.")
        }
    }

    const updateColor = (val) => {
        let curSlides = slides;
        curSlides[slideIdx].background = val;
        setSlides([...curSlides])
        SanitizeSlides();
        updateSlide();
    }

    const savePresentation = () => {
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        let presentationObject = {
            "name": presentationName,
            "slides": slides
        };
        fetch(`${baseURL}/${presentationName}/save`,
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
        )
            .then(response => {
                if (response.status !== 200) {
                    alert("Sorry, something went wrong.\nCould not save your presentation.")
                    return;
                }
            });
    }

    const fetchPresentation = () => {
        let splitPath = window.location.href.split("/");
        const pname = splitPath[4];
        console.log(pname);
        updatePresentationName(pname);
        const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
        const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
        fetch(`${baseURL}/${pname}`, { headers: headers, mode: 'cors', method: "GET" })
            .then(resp => {
                if (resp.status === 404) {
                    fetch(`${baseURL}/${pname}`, { method: "POST", headers: headers, mode: 'cors' })
                    setSlides([
                        {
                            slide_id: slideIdx,
                            background: "#2e3440",
                            content: []
                        }
                    ]);
                    return null;
                }
                else {
                    return resp.json()
                }
            }).then(data => {
                if (data && data.slides.length > 0) {
                    console.log(data);
                    setSlides(data.slides)
                }
            })
            .catch(
                () => alert("Sorry, could not fetch the presentation data")
            );
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
        let splitPath = window.location.href.split("/");
        const pname = splitPath[4];
        updatePresentationName(pname);
        fetchPresentation();
        // load modules in browser
        clientSideInitialization();
    }, [])

    return (
        <>
            <div className={styles.vertical}>
                <div className={styles.arrows}>
                    <FaArrowLeft onClick={() => {
                        if (slideIdx - 1 >= 0) {
                            setSlideIdx(slideIdx - 1);
                        }
                        updateSlide();
                    }
                    } />
                    <FaArrowRight onClick={() => {
                        updateSlide();
                        if ((slideIdx + 1) == slides.length) {
                            let curSlides = slides;
                            curSlides.push(
                                {
                                    slide_id: slideIdx + 1,
                                    background: "#2e3440",
                                    content: [],
                                }
                            )
                            setSlides(curSlides);
                            const baseURL = `${window.location.protocol}//${window.location.host.split(":")[0]}:${port}/user1`;
                            try {
                                const headers = { "Content-type": "application/json", 'Access-Control-Allow-Origin': '*' };
                                fetch(`${baseURL}/${presentationName}/add_slide`, { headers: headers, mode: 'cors', method: "POST" })
                                    .catch(
                                        () => alert("Sorry, could not fetch the presentation data")
                                    );
                                updateSlide();
                            } catch {
                                alert("Could not add slide. Sorry")
                            }
                        }
                        setSlideIdx(slideIdx + 1)
                    }
                    } />
                    <FaMinus onClick={removeSlide} />
                    <FaRedo onClick={fetchPresentation} />
                </div>
                <div className={styles.editorBox}>
                    <h2>
                        Slide {slideIdx + 1}
                        <FaPlus onClick={async () => {
                            let curSlides = slides;
                            curSlides[slideIdx].content.push(
                                {
                                    object_id: curSlides[slideIdx].content.length,
                                    object_type: "img",
                                    content: "https://picsum.photos/1920/1080",
                                }
                            )
                            setSlides([...curSlides]);
                            setSlideIdx(slideIdx);
                            SanitizeSlides();
                            updateSlide();
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
                    slides.length > 0 && Object.entries(slides[slideIdx].content).map(
                        v => <ElementEditor
                            key={`slide_component_${v[1].object_id}`}
                            type={v[1].object_type}
                            id={v[1].object_type}
                            name={v[1].slide_id}
                            required={true}
                            value={v[1].content}
                            attrs={`${v[1].slide_id}_attrs`}
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
