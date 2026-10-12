import { useEffect, useRef } from 'react';

interface PixelCanvasProps {
    pixels: Uint8ClampedArray | null;
    width: number;
    height: number;
    onPick?: (fx: number, fy: number) => void;
    marker?: { fx: number; fy: number } | null;
}

export function PixelCanvas({ pixels, width, height, onPick, marker }: PixelCanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !pixels) return;
        if (pixels.length !== width * height * 4) {
            console.error(`Expected ${width * height * 4} bytes, got ${pixels.length}`);
            return;
        }
        ctx.putImageData(new ImageData(pixels, width, height), 0, 0);
    }, [pixels, width, height]);

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!onPick) return;
        const r = e.currentTarget.getBoundingClientRect();
        onPick((e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height);
    };

    return (
        <div style={{ position: 'relative', width: '100%', maxWidth: width, border: '1px solid #ccc' }}>
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                onClick={handleClick}
                style={{ width: '100%', height: 'auto', display: 'block', cursor: onPick ? 'crosshair' : 'default' }}
            />
            {marker && (
                <div style={{
                    position: 'absolute',
                    left: `${marker.fx * 100}%`, top: `${marker.fy * 100}%`,
                    width: 10, height: 10, marginLeft: -5, marginTop: -5,
                    borderRadius: '50%', border: '2px solid white', background: 'red',
                    pointerEvents: 'none',
                }} />
            )}
        </div>
    );
}