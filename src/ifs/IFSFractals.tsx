import { BarnsleyAnimated } from './BarnsleyAnimated';
import {SierpinskiAnimated} from "./SierpinskiAnimated.tsx";

export function IFSFractals() {
    return (
        <div style={{ padding: 24 }}>
            <h2>IFS Fractals</h2>

            <p>
                Iterated Function Systems (IFS) generate fractals by repeatedly
                applying affine transformations to points.
            </p>

            <BarnsleyAnimated />
            <h2>IFS Fractals</h2>

            <p>
                Iterated Function Systems (IFS) generate fractals by repeatedly
                applying affine transformations to points.
            </p>

            <SierpinskiAnimated />
        </div>
    );
}