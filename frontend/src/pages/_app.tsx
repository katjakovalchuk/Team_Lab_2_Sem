import React from 'react';
import "../scss/globals.scss";
import "../scss/revealTheme.css"
import NavBar from "../components/bar";
import Overlay from "../components/overlayMenu";
import NewPresentation from "../components/newPresentation";
import { useState } from "react";
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    const [newPres, setNewPres] = useState(false);

    return (
        <>
            <NavBar setNewDisplay={setNewPres} />
            {newPres ? (
                <Overlay id="newPresOverlay" setDisplayState={setNewPres}>
                    <NewPresentation />
                </Overlay>
            ) : null}
            <div className="app">
                <Component {...pageProps} />
            </div>
        </>
    )
}
