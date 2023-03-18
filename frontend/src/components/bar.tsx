import { FaHome, FaPen, FaBook, FaEnvelopeOpenText } from "react-icons/fa";
import Overlay from "./overlayMenu";
import styles from "../scss/bar.module.scss";

interface BarProps {
    setNewDisplay: (val: boolean) => void;
}

export default function NavBar(props: BarProps) {
    return (
        <>
            <nav className={styles.navbar}>
                <a href="/" className={[styles.icon, styles.home].join(' ')}>
                    <FaHome />
                </a>
                <div className={styles.utils}>
                    <FaPen className={styles.icon} onClick={() => { props.setNewDisplay(true) }} />
                    <a href="/projects" className={styles.icon}>
                        <FaBook />
                    </a>
                    <a href="/login" className={styles.icon}>
                        <FaEnvelopeOpenText />
                    </a>
                </div>
            </nav>
        </>
    )
}
