import { ImCross } from "react-icons/im";
import styles from "../scss/popup.module.scss";

interface OverlayProps {
    id: string;
    setDisplayState: (val: boolean) => void;
    children: any;
    escapeable: boolean;
}

export default function Overlay(props: OverlayProps) {
    const sleep = (time: any) => {
        return new Promise((resolve) => setTimeout(resolve, time));
    }
    return (
        <div
            className={styles.container}
            onKeyDown={
                async (event) => {
                    sleep(2).then(
                        () => props.setDisplayState(
                            (event.key != "Enter" && event.key != "Escape") || !props.escapeable
                        )
                    )
                }
            }
            id={props.id}>
            <div className={styles.background} onClick={() => { props.setDisplayState(false) }}> </div>
            <div className={styles.formBox}>
                <ImCross className={styles.cross} onClick={() => { props.setDisplayState(false) }} />
                <div className={styles.content}>
                    {props.children}
                </div>
            </div>
        </div >
    )
}
