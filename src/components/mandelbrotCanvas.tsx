import React, { useEffect, useRef, useState } from "react";

const MandelbrotCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fetchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
    const abortRef = useRef<AbortController | null>(null);

    const [size, setSize] = useState({
        width: 900,
        height: 600,
    });
    const [view, setView] = useState({
        zoom: 0.8,
        offsetU: -0.5,
        offsetV: 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;

        // Cancel pending timeout and in-flight request
        if (fetchTimeout.current) clearTimeout(fetchTimeout.current);
        if (abortRef.current) abortRef.current.abort();

        fetchTimeout.current = setTimeout(() => {
            const controller = new AbortController();
            abortRef.current = controller;

            fetch("http://localhost:3001/render", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                signal: controller.signal,
                body: JSON.stringify({
                    width: size.width,
                    height: size.height,
                    offset_u: view.offsetU,
                    offset_v: view.offsetV,
                    zoom: view.zoom,
                    // A more aggressive scaling formula
                    max_iter: Math.floor(150 + 120 * Math.log10(view.zoom + 1))
// Or a linear/power growth if you plan to zoom deep:
// max_iter: Math.floor(200 + Math.pow(view.zoom, 0.4) * 100),
                }),
            })
                .then(r => r.arrayBuffer())
                .then(buf => {
                    const image = new ImageData(
                        new Uint8ClampedArray(buf),
                        size.width,
                        size.height
                    );
                    ctx.putImageData(image, 0, 0);
                })
                .catch(err => {
                    if (err.name !== "AbortError") console.error(err);
                });
        }, 120); // wait 120ms after last scroll before fetching

    }, [view, size]);

    const pixelToComplex = (
        px: number, py: number,
        zoom: number, offsetU: number, offsetV: number,
        width: number, height: number
    ) => {
        const scale = (3.5 / width) / zoom;
        return {
            u: offsetU + (px - width / 2) * scale,
            v: offsetV + (py - height / 2) * scale,
        };
    };

    // Remove onWheel from the canvas element entirely
// Add this useEffect instead:

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const onWheel = (e: WheelEvent) => {
            e.preventDefault();

            const rect = canvas.getBoundingClientRect();
            const { width, height } = canvas;

            const px = e.clientX - rect.left;
            const py = e.clientY - rect.top;

            setView(prev => {
                const { u: mouseU, v: mouseV } = pixelToComplex(
                    px, py, prev.zoom, prev.offsetU, prev.offsetV, width, height
                );

                const zoomFactor = Math.exp(-e.deltaY * 0.01);  // was 0.003, now 0.01
                const newZoom = prev.zoom * zoomFactor;
                const newScale = (3.5 / width) / newZoom;

                return {
                    zoom: newZoom,
                    offsetU: mouseU - (px - width / 2) * newScale,
                    offsetV: mouseV - (py - height / 2) * newScale,
                };
            });
        };

        canvas.addEventListener("wheel", onWheel, { passive: false });
        return () => canvas.removeEventListener("wheel", onWheel);
    }, []);

    const handleDoubleClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current!;
        const rect = canvas.getBoundingClientRect();
        const { width, height } = canvas;

        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;

        const { u: mouseU, v: mouseV } = pixelToComplex(
            px, py, view.zoom, view.offsetU, view.offsetV, width, height
        );

        const zoomFactor = e.shiftKey ? 0.5 : 2;
        const newZoom = view.zoom * zoomFactor;
        const newScale = (3.5 / width) / newZoom;

        setView({
            zoom: newZoom,
            offsetU: mouseU - (px - width / 2) * newScale,
            offsetV: mouseV - (py - height / 2) * newScale,
        });
    };

    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!dragging.current) return;

        const canvas = canvasRef.current!;
        const currentX = e.clientX;
        const currentY = e.clientY;

        setView((prev) => {
            const dx = currentX - last.current.x;
            const dy = currentY - last.current.y;
            last.current = { x: currentX, y: currentY };

            const scale = (3.5 / canvas.width) / prev.zoom;
            return {
                ...prev,
                offsetU: prev.offsetU - dx * scale,
                offsetV: prev.offsetV - dy * scale,
            };
        });
    };

    const handleMouseUp = () => {
        dragging.current = false;
        last.current = { x: 0, y: 0 };
    };

    return (
        <canvas
            ref={canvasRef}
            width={900}
            height={600}

            onDoubleClick={handleDoubleClick}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{
                cursor: "crosshair",
                border: "1px solid #333",
            }}
        />
    );
};

export default MandelbrotCanvas;