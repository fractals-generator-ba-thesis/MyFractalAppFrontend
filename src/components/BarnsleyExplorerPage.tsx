import BarnsleyFern from "../components/BarnsleyFern";
import MandelbrotMap from "../mandelbrot/MandelbrotMap.tsx";
import {useState} from "react";

export default function ExplorerPage() {
    const [tab, setTab] = useState<"mandelbrot" | "barnsley">("mandelbrot");

    return (
        <div style={{ width: "100vw", height: "100vh", position: "relative" }}>

            {/* Tab navigacija */}
            <div style={{
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 1000,
                display: "flex",
                gap: 8,
            }}>
                <button
                    onClick={() => setTab("mandelbrot")}
                    style={{
                        background: tab === "mandelbrot" ? "#444" : "#222",
                        color: "white",
                        border: "1px solid #555",
                        borderRadius: 4,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontFamily: "monospace",
                    }}
                >
                    Mandelbrot
                </button>
                <button
                    onClick={() => setTab("barnsley")}
                    style={{
                        background: tab === "barnsley" ? "#2d5a27" : "#222",
                        color: "white",
                        border: "1px solid #555",
                        borderRadius: 4,
                        padding: "6px 16px",
                        cursor: "pointer",
                        fontFamily: "monospace",
                    }}
                >
                    Barnsley Paprat
                </button>
            </div>

            {/* Prikaz na osnovu taba */}
            {tab === "mandelbrot" && (
                <>
                    <MandelbrotMap />
                    {/* твој postojeći Julia panel */}
                </>
            )}

            {tab === "barnsley" && (
                <div style={{
                    width: "100vw",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#111",
                }}>
                    <BarnsleyFern />
                </div>
            )}
        </div>
    );
}