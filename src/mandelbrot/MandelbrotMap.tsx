import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { WorkerPool } from "./workerPool";

const TILE_SIZE = 256;
const WORKER_COUNT = navigator.hardwareConcurrency || 4;

const pool = new WorkerPool(WORKER_COUNT, "./mandelbrotWorker.ts");

function createMandelbrotLayer() {
    return L.GridLayer.extend({
        createTile(coords: L.Coords, done: L.DoneCallback) {
            const canvas = document.createElement("canvas");
            canvas.width = TILE_SIZE;
            canvas.height = TILE_SIZE;
            const ctx = canvas.getContext("2d")!;

            const maxIter = Math.floor(100 + 30 * coords.z);

            pool.post({
                x: coords.x,
                y: coords.y,
                z: coords.z,
                tileSize: TILE_SIZE,
                maxIter,
            }).then((buf: ArrayBuffer) => {
                const image = new ImageData(
                    new Uint8ClampedArray(buf),
                    TILE_SIZE,
                    TILE_SIZE
                );
                ctx.putImageData(image, 0, 0);
                done(undefined, canvas);
            });

            return canvas;
        },
    });
}

export default function MandelbrotMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMap = useRef<L.Map | null>(null);

    useEffect(() => {
        if (!mapRef.current || leafletMap.current) return;

        // Use plain pixel CRS — 1 tile = 256px
        const map = L.map(mapRef.current, {
            crs: L.CRS.Simple,
            center: [0, 0],
            zoom: 2,
            minZoom: 0,
            maxZoom: 28,
            zoomAnimation: true,
            attributionControl: false,
        });

        const MandelbrotLayer = createMandelbrotLayer();
        new (MandelbrotLayer as any)({
            tileSize: TILE_SIZE,
            minZoom: 0,
            maxZoom: 28,
            // No bounds — let it tile freely
        }).addTo(map);

        // Center view on the fractal origin
        // At zoom 2, total = 4x4 tiles = 1024x1024px
        // Fractal center (-0.5, 0) in complex plane
        map.setView([-80, 140], 2);

        leafletMap.current = map;

        return () => {
            map.remove();
            leafletMap.current = null;
        };
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ width: "100vw", height: "100vh", background: "black" }}
        />
    );
}