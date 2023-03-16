import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { TextInput, } from "./textInput";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus, FaMinus, FaSave } from "react-icons/fa"

export default function Editor(props) {
    const [presentationName, updatePresentationName] = useState("Presentation");
    const [slides, setSlides] = useState(
        [
            {
                name: "Slide 1",
                background: "",
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
            },
            {
                name: "Slide 2",
                background: "",
                content: [
                    {
                        name: "page_one_2",
                        type: "img",
                        content: "https://picsum.photos/200/300",
                    },
                    {
                        name: "page_two_2",
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
            setSlides([...curSlides]);
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].type = val;
            setSlides([...curSlides]);
        }
        return updateFn;
    }

    const updateElementName = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].name = val;
            setSlides([...curSlides]);
        }
        return updateFn;
    }

    const removeComponent = (index) => {
        let curSlides = slides;
        const updateFn = (_) => {
            delete curSlides[slideIdx].content[index];
            setSlides([...curSlides]);
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
    }

    const updateColor = (val) => {
        let curSlides = slides;
        curSlides[slideIdx].background = val;
        setSlides([...curSlides])
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
            alert("Sorry, something went wrong.\nWe could not save your presentation.")
            return;
        }
        console.log(response);
    }

    useEffect(() => {
        // const headers = { "Content-type": "application/json" };
        // fetch(`/api/presentations/${props.presentationId}`, { headers })
        //     .then(resp => resp.json())
        //     .then(data => setSlides(data["slides"]))
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
                                    background: "",
                                    content: [
                                        {
                                            name: `page_one_${curSlides.length + 1}`,
                                            type: "img",
                                            content: "https://picsum.photos/200/300",
                                        },
                                        {
                                            name: "page_two_2",
                                            type: "img",
                                            content: "https://picsum.photos/200/300",
                                        }
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
            </div>
        </>
    )
}
