declare const self: Worker;

self.onmessage = async (e) => {
    const { x, y, z, tileSize, maxIter } = e.data;

    const res = await fetch("http://localhost:3001/render-tile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            x, y, z,
            tile_size: tileSize,
            max_iter: maxIter,
        }),
    });

    const buf = await res.arrayBuffer();
    self.postMessage({ x, y, z, buffer: buf }, [buf]);
};