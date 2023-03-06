import { FaHome, FaPen, FaBook, FaEnvelopeOpenText } from "react-icons/fa";
import styles from "../scss/bar.module.scss";

export default function NavBar() {
    return (
        <>
            <nav className={styles.navbar}>
                <a href="/" className={[styles.icon, styles.home].join(' ')}>
                    <FaHome />
                </a>
                <div className={styles.utils}>
                    <a href="/new" className={styles.icon}>
                        <FaPen />
                    </a>
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
