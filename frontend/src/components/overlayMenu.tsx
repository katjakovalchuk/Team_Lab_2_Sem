import { ImCross } from "react-icons/im";
import styles from "../scss/popup.module.scss";

export default function Overlay(props) {
    return (
        <div className={styles.container} id={props.id}>
            <div className={styles.background} onClick={() => { props.setDisplayState(false) }}> </div>
            <div className={styles.formBox}>
                <ImCross className={styles.cross} onClick={() => { props.setDisplayState(false) }} />
                <div className={styles.content}>
                    {props.children}
                </div>
            </div>
        </div>
    )
}
