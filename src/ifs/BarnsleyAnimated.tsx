import { useEffect, useRef, useState } from 'react';

export function BarnsleyAnimated() {
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

        const colors = [
            'rgba(255, 80, 80, 0.6)',   // stem
            'rgba(80, 120, 255, 0.6)',  // left leaf
            'rgba(180, 80, 255, 0.6)',  // right leaf
            'rgba(40, 180, 80, 0.6)'    // main structure
        ];

        let x = 0;
        let y = 0;

        function step() {
            if (!runningRef.current) {
                frameRef.current = requestAnimationFrame(step);
                return;
            }

            for (let i = 0; i < 200; i++) {

                const r = Math.random();

                let x1 = 0;
                let y1 = 0;
                let mode = 3;

                // 🌿 IFS transformations
                if (r < 0.01) {
                    x1 = 0;
                    y1 = 0.16 * y;
                    mode = 0;
                }
                else if (r < 0.08) {
                    x1 = 0.2 * x - 0.26 * y;
                    y1 = 0.23 * x + 0.22 * y + 1.6;
                    mode = 1;
                }
                else if (r < 0.15) {
                    x1 = -0.15 * x + 0.28 * y;
                    y1 = 0.26 * x + 0.24 * y + 0.44;
                    mode = 2;
                }
                else {
                    x1 = 0.85 * x + 0.04 * y;
                    y1 = -0.04 * x + 0.85 * y + 1.6;
                    mode = 3;
                }

                x = x1;
                y = y1;

                const px = Math.floor((x + 3) / 6 * width);
                const py = Math.floor(height - (y / 10 * height));

                if (px >= 0 && px < width && py >= 0 && py < height) {
                    ctx.fillStyle = colors[mode];
                    ctx.fillRect(px, py, 1, 1);
                }
            }

            frameRef.current = requestAnimationFrame(step);
        }

        // start fresh
        ctx.clearRect(0, 0, width, height);
        step();

        return () => {
            if (frameRef.current) cancelAnimationFrame(frameRef.current);
        };
    }, []);

    // sync React state → ref
    useEffect(() => {
        runningRef.current = running;
    }, [running]);

    const handleReset = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // reset simulation state
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // restart point
        runningRef.current = true;
        setRunning(true);

        // reset coordinates by restarting whole animation loop
        // easiest safe way: reload effect logic by remount trick
        // (we manually reinitialize by forcing canvas clear + restart loop state)

        let x = 0;
        let y = 0;

        function step() {
            if (!runningRef.current) {
                frameRef.current = requestAnimationFrame(step);
                return;
            }

            for (let i = 0; i < 800; i++) {

                const r = Math.random();

                let x1 = 0;
                let y1 = 0;
                let mode = 3;

                if (r < 0.01) {
                    x1 = 0;
                    y1 = 0.16 * y;
                    mode = 0;
                }
                else if (r < 0.08) {
                    x1 = 0.2 * x - 0.26 * y;
                    y1 = 0.23 * x + 0.22 * y + 1.6;
                    mode = 1;
                }
                else if (r < 0.15) {
                    x1 = -0.15 * x + 0.28 * y;
                    y1 = 0.26 * x + 0.24 * y + 0.44;
                    mode = 2;
                }
                else {
                    x1 = 0.85 * x + 0.04 * y;
                    y1 = -0.04 * x + 0.85 * y + 1.6;
                    mode = 3;
                }

                x = x1;
                y = y1;

                const px = Math.floor((x + 3) / 6 * canvas.width);
                const py = Math.floor(canvas.height - (y / 10 * canvas.height));

                ctx.fillStyle = [
                    'rgba(255, 80, 80, 0.6)',
                    'rgba(80, 120, 255, 0.6)',
                    'rgba(180, 80, 255, 0.6)',
                    'rgba(40, 180, 80, 0.6)'
                ][mode];

                ctx.fillRect(px, py, 1, 1);
            }

            frameRef.current = requestAnimationFrame(step);
        }

        step();
    };

    return (
        <div style={{ padding: 20 }}>
            <h2>Barnsley Fern – IFS Visualization</h2>

            {/* CONTROLS */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                <button onClick={() => setRunning(r => !r)}>
                    {running ? 'Pause' : 'Resume'}
                </button>

                <button onClick={handleReset}>
                    Reset
                </button>
            </div>

            <p style={{ marginBottom: 10 }}>
                Red = stem · Blue = left leaf · Purple = right leaf · Green = main structure
            </p>

            <canvas
                ref={canvasRef}
                width={500}
                height={600}
                style={{
                    border: '1px solid #ccc',
                    background: 'white',
                    display: 'block'
                }}
            />
        </div>
    );
}