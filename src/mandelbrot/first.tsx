
export default function mandelbrot(x: number, y: number, maxIter: number): number {
    let u = 0;
    let v = 0;
    let iter = 0;

    while (u * u + v * v <= 4 && iter < maxIter) {
        const uTemp = u * u - v * v + x;
        v = 2 * u * v + y;
        u = uTemp;
        iter++;
    }

    return iter;
}