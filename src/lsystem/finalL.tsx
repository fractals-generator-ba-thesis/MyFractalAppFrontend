import { useMemo, useState } from 'react';
import { generateFractalRecursive } from '../lsystem/generateFractal';
import { PRESETS } from '../lsystem/presets';
import { FractalCanvas } from '../components/FractalCanvas';
import '../Fin.css'

export default function Fin() {
    const [presetKey, setPresetKey] = useState<keyof typeof PRESETS>('kochCurve');
    const preset = PRESETS[presetKey];

    const [n, setN] = useState(preset.n);
    const [angle, setAngle] = useState(preset.angle);
    const [d, setD] = useState(preset.d);

    const l = useMemo(
        () =>
            generateFractalRecursive(
                {
                    axiom: preset.axiom,
                    rules: preset.rules,
                    d,
                    turnAngle: angle,
                    n
                },
                preset.startAngle
            ),
        [preset, d, angle, n]
    );

    const handlePresetChange = (key: keyof typeof PRESETS) => {
        setPresetKey(key);
        setN(PRESETS[key].n);
        setAngle(PRESETS[key].angle);
        setD(PRESETS[key].d);
    };

    return (
        <div className="fractal-page">
            <div className="controls">
                <h2>Lindenmayer fractal generator</h2>

                <label>
                    Preset:
                    <select
                        value={presetKey}
                        onChange={(e) =>
                            handlePresetChange(
                                e.target.value as keyof typeof PRESETS
                            )
                        }
                    >
                        {Object.keys(PRESETS).map((key) => (
                            <option key={key} value={key}>
                                {key}
                            </option>
                        ))}
                    </select>
                </label>

                <label>
                    Iterations (n): {n}
                    <input
                        type="range"
                        min={0}
                        max={8}
                        value={n}
                        onChange={(e) => setN(Number(e.target.value))}
                    />
                </label>

                <label>
                    Angle (α): {angle}°
                    <input
                        type="range"
                        min={1}
                        max={180}
                        value={angle}
                        onChange={(e) => setAngle(Number(e.target.value))}
                    />
                </label>

                <label>
                    Step distance (d): {d}
                    <input
                        type="range"
                        min={1}
                        max={30}
                        value={d}
                        onChange={(e) => setD(Number(e.target.value))}
                    />
                </label>
            </div>

            <div className="canvas-container">
                <FractalCanvas paths={l} />
            </div>
        </div>
    );
}
