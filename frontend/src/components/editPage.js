import styles from "../scss/editor.module.scss";
import ElementEditor from "./editElement";
import { useEffect, useState } from "react";
import { FaArrowRight, FaArrowLeft, FaPlus } from "react-icons/fa"

export default function Editor(props) {
    const [slides, setSlides] = useState(
        [
            {
                name: "slide_1",
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
                name: "slide_2",
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
            setSlides(curSlides);
        }
        return updateFn;
    }

    const updateElementType = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].type = val;
            setSlides(curSlides);
        }
        return updateFn;
    }

    const updateElementName = (element) => {
        let curSlides = slides;
        const updateFn = (val) => {
            curSlides[slideIdx].content[element].name = val;
            setSlides(curSlides);
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
                </div>
                <h2>{slides[slideIdx].name}</h2>
                {
                    Object.entries(slides[slideIdx].content).map(
                        v => <ElementEditor key={`${v[1].name}_${v[0]}`} type={v[1].type} id={v[1].name} name={v[1].name} required={true} value={v[1].content} updateContent={updateElementContent(v[0])} updateName={updateElementName(v[0])} updateType={updateElementType(v[0])} />
                    )
                }
            </div>
        </>
    )
}
