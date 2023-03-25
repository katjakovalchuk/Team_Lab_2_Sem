import React from "react";
import Head from 'next/head'
import styles from "../scss/error.module.scss"

export default function App({ }) {
    return (
        <>
            <Head>
                <title>404 - Reevaler</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.error}>
                    <h1 className={styles.title}>404</h1>
                    <div className={styles.text}>
                        <p className={styles.description}>Page not found</p>
                    </div>
                </div>
            </div>
        </>
    )
}
