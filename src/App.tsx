import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import MandelbrotMap from "./mandelbrot/MandelbrotMap";
import Fin from "./lsystem/finalL";
import {JuliaExplorer} from "./juliaSets/JuliaExplorer.tsx";
import ExplorerPage from "./components/BarnsleyExplorerPage.tsx";
import {IFSFractals} from "./ifs/IFSFractals.tsx";

function App() {
    return (
        <Router>
            <div style={{ fontFamily: "sans-serif" }}>

                {/* MENU */}
                <nav style={{
                    display: "flex",
                    gap: 16,
                    padding: 16,
                    background: "#eee"
                }}>
                    <Link to="/">Mandelbrot</Link>
                    <Link to="/lsystem">L-System</Link>
                    <Link to="/julia">JuliaExplorer</Link>
                    <Link to="/ifs">IFS Fractals</Link>
                </nav>

                {/* PAGES */}
                <div style={{ padding: 24 }}>
                    <Routes>
                        <Route path="/" element={<MandelbrotMap />} />
                        <Route path="/lsystem" element={<Fin />} />
                        <Route path="/julia" element={<JuliaExplorer />} />
                        <Route path="/ifs" element={<IFSFractals />} />
                    </Routes>
                </div>

            </div>
        </Router>
    );
}

export default App;