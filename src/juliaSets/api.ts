const API = 'http://localhost:3001';

async function post(path: string, body: object, signal?: AbortSignal): Promise<Uint8ClampedArray> {
    const res = await fetch(`${API}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal,
    });
    if (!res.ok) throw new Error(`${path} failed: ${res.status}`);
    return new Uint8ClampedArray(await res.arrayBuffer());
}

export interface MandelView {
    offset_u: number;
    offset_v: number;
    zoom: number;
}

export function fetchMandelbrot(
    view: MandelView, width: number, height: number, maxIter: number, signal?: AbortSignal
) {
    return post('/render', { width, height, max_iter: maxIter, ...view }, signal);
}

export function fetchJulia(
    c: { u: number; v: number }, size: number, maxIter: number, signal?: AbortSignal
) {
    return post('/render-julia', {
        tile_size: size,
        max_iter: maxIter,
        c_u: c.u,
        c_v: c.v,
    }, signal);
}