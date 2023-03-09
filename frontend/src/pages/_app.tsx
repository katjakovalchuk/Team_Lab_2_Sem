import React from 'react';
import "../scss/globals.scss";
import NavBar from "../components/bar";
import Overlay from "../components/overlayMenu";
import NewPersentationPage from "../components/newPresentationPage";
import { useState } from "react";
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    const [newPres, setNewPres] = useState(false);

    return (
        <>
            <NavBar setNewDisplay={setNewPres} />
            {newPres ? (
                <Overlay id="newPresOverlay" setDisplayState={setNewPres}>
                    <NewPersentationPage />
                </Overlay>
            ) : null}
            <div className="app">
                <Component {...pageProps} />
            </div>
        </>
    )
}
