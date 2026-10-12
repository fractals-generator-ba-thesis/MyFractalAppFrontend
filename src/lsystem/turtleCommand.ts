import type {Point, TurtleSnapshot} from "./types.ts";

export interface TurtleContext {
    x: number;
    y: number;
    angle: number;        // φ
    prevChar: string;     // c'
    stack: TurtleSnapshot[]; // S
    v: Point[];      // V
    l: Point[][];      // L
}

export function executeTurtleCommand(
    c: string,
    ctx: TurtleContext,
    d: number,
    turnAngle: number
): void {
    const rad = () => (ctx.angle * Math.PI) / 180;

    switch (c) {
        case 'F':
        case 'G':
            if (ctx.v.length === 0) ctx.v.push({ x: ctx.x, y: ctx.y });
            ctx.x += d * Math.cos(rad());
            ctx.y += d * Math.sin(rad());
            ctx.v.push({ x: ctx.x, y: ctx.y });
            break;

        case 'f':
            if (ctx.v.length > 0) {
                ctx.l.push(ctx.v);
                ctx.v = [];
            }
            ctx.x += d * Math.cos(rad());
            ctx.y += d * Math.sin(rad());
            break;

        case '+':
            ctx.angle += turnAngle;
            break;

        case '-':
            ctx.angle -= turnAngle;
            break;

        case '[':
            ctx.stack.push({ x: ctx.x, y: ctx.y, angle: ctx.angle });
            break;

        case ']': {
            if (ctx.v.length > 0) {
                ctx.l.push(ctx.v);
                ctx.v = [];
            }
            const snap = ctx.stack.pop();
            if (snap) {
                ctx.x = snap.x;
                ctx.y = snap.y;
                ctx.angle = snap.angle;
            }
            break;
        }

        default:
            break;
    }
}