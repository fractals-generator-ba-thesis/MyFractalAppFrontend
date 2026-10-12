import { useEffect, useRef, useState } from "react";

const WIDTH  = 600;
const HEIGHT = 800;

export default function BarnsleyFern() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [iterations, setIterations] = useState(200000);
    const [loading, setLoading] = useState(false);

    const render = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        setLoading(true);

        fetch("http://localhost:3001/render-barnsley", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                width: WIDTH,
                height: HEIGHT,
                iterations,
            }),
        })
            .then(r => r.arrayBuffer())
            .then(buf => {
                const image = new ImageData(
                    new Uint8ClampedArray(buf),
                    WIDTH,
                    HEIGHT
                );
                ctx.putImageData(image, 0, 0);
                setLoading(false);
            });
    };

    // Renderiraj na mount
    useEffect(() => { render(); }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            background: "#111",
            padding: 24,
            borderRadius: 8,
        }}>
            <h2 style={{ color: "white", fontFamily: "monospace", margin: 0 }}>
                Barnsley Paprat
            </h2>

            <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                style={{ border: "1px solid #333" }}
            />

            {/* Kontrola broja iteracija */}
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "white",
                fontFamily: "monospace",
            }}>
                <label>Iteracije: {iterations.toLocaleString()}</label>
                <input
                    type="range"
                    min={10000}
                    max={1000000}
                    step={10000}
                    value={iterations}
                    onChange={e => setIterations(Number(e.target.value))}
                />
                <button
                    onClick={render}
                    disabled={loading}
                    style={{
                        background: "#2d5a27",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        padding: "6px 16px",
                        cursor: loading ? "wait" : "pointer",
                        fontFamily: "monospace",
                    }}
                >
                    {loading ? "Renderujem..." : "Generiši"}
                </button>
            </div>

            <p style={{
                color: "#666",
                fontFamily: "monospace",
                fontSize: 11,
                textAlign: "center",
                maxWidth: 400,
            }}>
                Igra haosa — svaka tačka se bira nasumično ali zajedno
                formiraju deterministički oblik paprati
            </p>
        </div>
    );
}