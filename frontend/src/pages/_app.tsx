import React from 'react';
import "../scss/globals.scss";
import "../scss/revealTheme.css"
import NavBar from "../components/bar";
import Overlay from "../components/overlayMenu";
import NewPresentation from "../components/newPresentation";
import SearchPresentations from "../components/searchPresentations";
import { useState } from "react";
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    const [newPres, setNewPres] = useState(false);
    const [search, setSearch] = useState(false);

    return (
        <>
            <NavBar setNewPresDisplay={setNewPres} setSearchDisplay={setSearch} />
            {newPres ? (
                <Overlay id="newPresOverlay" setDisplayState={setNewPres} escapeable={true}>
                    <NewPresentation />
                </Overlay>
            ) : null}
            {search ? (
                <Overlay id="searchOverlay" setDisplayState={setSearch} escapeable={false}>
                    <SearchPresentations />
                </Overlay>
            ) : null}
            <div className="app">
                <Component {...pageProps} />
            </div>
        </>
    )
}
