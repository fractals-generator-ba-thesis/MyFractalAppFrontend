import { useEffect, useMemo, useState } from 'react';
import { fetchJulia, fetchMandelbrot, type MandelView } from './api';
import { PixelCanvas } from './PixelCanvas';

const M_W = 700, M_H = 500;
const J_SIZE = 500;
const MAX_ITER = 200;

const VIEW: MandelView = { offset_u: -0.5, offset_v: 0, zoom: 1 };

// Douady rabbit c vrijednost
const RABBIT = { u: -0.1226, v: 0.7449 };

function pixelToComplex(fx: number, fy: number, view: MandelView) {
    const scale = 3.5 / (M_W * view.zoom);
    return {
        u: view.offset_u + (fx * M_W - M_W / 2) * scale,
        v: view.offset_v + (fy * M_H - M_H / 2) * scale,
    };
}

export function JuliaExplorer() {
    const [mandel, setMandel] = useState<Uint8ClampedArray | null>(null);
    const [julia, setJulia] = useState<Uint8ClampedArray | null>(null);
    const [pick, setPick] = useState<{ fx: number; fy: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Defaultuje na RABBIT dok korisnik ne klikne
    const c = useMemo(
        () => (pick ? pixelToComplex(pick.fx, pick.fy, VIEW) : RABBIT),
        [pick]
    );

    // Učitaj Mandelbrot jednom
    useEffect(() => {
        const ac = new AbortController();
        fetchMandelbrot(VIEW, M_W, M_H, MAX_ITER, ac.signal)
            .then(setMandel)
            .catch((e) => { if (e.name !== 'AbortError') setError(String(e)); });
        return () => ac.abort();
    }, []);

    // Učitaj Julia kad se c promijeni — uključujući i prvi render
    useEffect(() => {
        const ac = new AbortController();
        fetchJulia(c, J_SIZE, MAX_ITER, ac.signal)
            .then(setJulia)
            .catch((e) => { if (e.name !== 'AbortError') setError(String(e)); });
        return () => ac.abort();
    }, [c]);

    return (
        <div style={{
            padding: 16,
            background: 'white',       // ← bijela pozadina
            minHeight: '100vh',
            color: 'black',            // ← crni tekst
            fontFamily: 'monospace'
        }}>

            <h2 style={{ margin: '0 0 12px 0' }}>Julia Explorer</h2>

            <p style={{ margin: '0 0 16px 0' }}>
                {`c = ${c.u.toFixed(4)} ${c.v >= 0 ? '+' : '-'} ${Math.abs(c.v).toFixed(4)}i`}
                {!pick && (
                    <span style={{ color: '#888', marginLeft: 8 }}>
                        (Douady rabbit — klikni na Mandelbrot za drugi Julia set)
                    </span>
                )}
            </p>

            {error && <p style={{ color: 'crimson' }}>{error}</p>}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'flex-start' }}>
                {/* Mandelbrot */}
                <div style={{ flex: '7 1 320px', minWidth: 0 }}>
                    <p style={{ color: '#aaa', margin: '0 0 6px 0', fontSize: 12 }}>
                        MANDELBROT SET
                    </p>
                    <PixelCanvas
                        pixels={mandel}
                        width={M_W}
                        height={M_H}
                        onPick={(fx, fy) => setPick({ fx, fy })}
                        marker={pick}
                    />
                </div>

                {/* Julia */}
                <div style={{ flex: '5 1 260px', minWidth: 0 }}>
                    <p style={{ color: '#aaa', margin: '0 0 6px 0', fontSize: 12 }}>
                        JULIA SET
                    </p>
                    {julia
                        ? <PixelCanvas pixels={julia} width={J_SIZE} height={J_SIZE} />
                        : <div style={{
                            aspectRatio: '1',
                            border: '1px dashed #444',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#555',
                        }}>
                            Učitavanje...
                        </div>
                    }
                </div>
            </div>

            {/* Reset dugme */}
            {pick && (
                <button
                    onClick={() => setPick(null)}
                    style={{
                        marginTop: 16,
                        background: '#333',
                        color: 'white',
                        border: '1px solid #555',
                        borderRadius: 4,
                        padding: '6px 16px',
                        cursor: 'pointer',
                        fontFamily: 'monospace',
                    }}
                >
                    Reset na Douady Rabbit
                </button>
            )}
        </div>
    );
}