import { FaHome, FaPen, FaBook } from "react-icons/fa";
import './index.css'
import './app.css'


export function App() {
    return (
        <>
            <div class="main">
                <nav class="navbar">
                    <a href="/" class="icon home">
                        <FaHome />
                    </a>
                    <div class="utils">
                        <a href="/new" class="icon">
                            <FaPen />
                        </a>
                        <a href="/projects" class="icon">
                            <FaBook />
                        </a>
                    </div>
                </nav>
            </div>
        </>
    )
}
