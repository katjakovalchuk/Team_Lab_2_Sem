import { FaHome, FaPen, FaBook, FaEnvelopeOpenText } from "react-icons/fa";
import Link from "next/link";
import styles from "../scss/bar.module.scss";

interface BarProps {
    setSearchDisplay: (val: boolean) => void;
    setNewPresDisplay: (val: boolean) => void;
}

export default function NavBar(props: BarProps) {
    return (
        <>
            <nav className={styles.navbar}>
                <Link href="/" className={[styles.icon, styles.home].join(' ')}>
                    <FaHome />
                </Link>
                <div className={styles.utils}>
                    <FaPen className={styles.icon} onClick={() => { props.setNewPresDisplay(true) }} />
                    <FaBook className={styles.icon} onClick={() => { props.setSearchDisplay(true) }} />
                    <Link href="/login" className={styles.icon}>
                        <FaEnvelopeOpenText />
                    </Link>
                </div>
            </nav>
        </>
    )
}
