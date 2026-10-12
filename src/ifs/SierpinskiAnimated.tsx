import { useEffect, useRef, useState } from 'react';

export function SierpinskiAnimated() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [running, setRunning] = useState(true);
    const runningRef = useRef(true);
    const frameRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;

        // 🌟 triangle vertices
        const A = { x: width / 2, y: 50 };
        const B = { x: 50, y: height - 50 };
        const C = { x: width - 50, y: height - 50 };

        const colors = [
            'rgba(255, 80, 80, 0.7)',   // A
            'rgba(80, 120, 255, 0.7)',  // B
            'rgba(40, 180, 80, 0.7)'    // C
        ];

        let x = Math.random() * width;
        let y = Math.random() * height;

        function step() {
            if (!runningRef.current) {
                frameRef.current = requestAnimationFrame(step);
                return;
            }

            for (let i = 0; i < 100; i++) {

                const r = Math.random();
                let target;
                let mode = 0;

                if (r < 1 / 3) {
                    target = A;
                    mode = 0;
                } else if (r < 2 / 3) {
                    target = B;
                    mode = 1;
                } else {
                    target = C;
                    mode = 2;
                }

                // midpoint step
                x = (x + target.x) / 2;
                y = (y + target.y) / 2;

                ctx.fillStyle = colors[mode];
                ctx.fillRect(x, y, 1, 1);
            }

            frameRef.current = requestAnimationFrame(step);
        }

        ctx.clearRect(0, 0, width, height);
        step();

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    // sync state
    useEffect(() => {
        runningRef.current = running;
    }, [running]);

    const handleReset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        runningRef.current = true;
        setRunning(true);
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Sierpinski Gasket – Chaos Game</h2>

            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <button onClick={() => setRunning(r => !r)}>
                    {running ? 'Pause' : 'Resume'}
                </button>

                <button onClick={handleReset}>
                    Reset
                </button>
            </div>

            <p style={{ marginBottom: 10 }}>
                Each point moves halfway toward a randomly chosen vertex.
            </p>

            <canvas
                ref={canvasRef}
                width={500}
                height={500}
                style={{
                    border: '1px solid #ccc',
                    background: 'white',
                    display: 'block'
                }}
            />
        </div>
    );
}