import React from 'react';
import "../scss/globals.scss"
import NavBar from "../components/bar";

function SafeHydrate({ children }) {
    return (
        <div suppressHydrationWarning>
            {typeof window === 'undefined' ? null : children}
        </div>
    )
}

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <NavBar />
            <div className="app">
                <Component {...pageProps} />
            </div>
        </>
    )
}
