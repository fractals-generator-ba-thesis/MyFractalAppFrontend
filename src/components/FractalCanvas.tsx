import { useEffect, useRef, useState } from 'react';
import type { Point } from '../lsystem/types';

interface FractalCanvasProps {
    paths: Point[][];
    maxSize?: number;
}

export function FractalCanvas({ paths, maxSize = 800 }: FractalCanvasProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [size, setSize] = useState(maxSize);

    // Track container width
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new ResizeObserver(([entry]) => {
            const w = Math.floor(entry.contentRect.width);
            if (w > 0) setSize(Math.min(w, maxSize));
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [maxSize]);

    // Draw whenever paths or size change
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, size, size);
        if (paths.length === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const path of paths) {
            for (const p of path) {
                minX = Math.min(minX, p.x);
                minY = Math.min(minY, p.y);
                maxX = Math.max(maxX, p.x);
                maxY = Math.max(maxY, p.y);
            }
        }

        const drawWidth = maxX - minX || 1;
        const drawHeight = maxY - minY || 1;
        const padding = 20;
        const scale = Math.min(
            (size - padding * 2) / drawWidth,
            (size - padding * 2) / drawHeight
        );

        const offsetX = padding - minX * scale + (size - padding * 2 - drawWidth * scale) / 2;
        const offsetY = padding - minY * scale + (size - padding * 2 - drawHeight * scale) / 2;

        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1;

        for (const path of paths) {
            if (path.length < 2) continue;
            ctx.beginPath();
            ctx.moveTo(path[0].x * scale + offsetX, path[0].y * scale + offsetY);
            for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].x * scale + offsetX, path[i].y * scale + offsetY);
            }
            ctx.stroke();
        }
    }, [paths, size]);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', maxWidth: maxSize, border: '1px solid #ccc' }}
        >
            <canvas
                ref={canvasRef}
                style={{ width: size, height: size, display: 'block' }}
            />
        </div>
    );
}