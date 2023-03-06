import styles from '../scss/app.module.scss';
import NavBar from "./bar";


export default function MainPage() {
    return (
        <>
            <div className={styles.main}>
                <div className={styles.info}>
                    <h1>
                        Hiya there!
                    </h1>
                    <span>
                        Would you like to make nice presentations?
                    </span>
                    <span>
                        …
                    </span>
                    <span>
                        TODO: I can't write for shite.
                    </span>
                    <span>
                        Improve this please
                    </span>
                </div>
            </div>
        </>
    )

}
