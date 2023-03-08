import React from 'react';
import "../scss/globals.scss";
import NavBar from "../components/bar";
import { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
    return (
        <>
            <NavBar />
            <div className="app">
                <Component {...pageProps} />
            </div>
        </>
    )
}
