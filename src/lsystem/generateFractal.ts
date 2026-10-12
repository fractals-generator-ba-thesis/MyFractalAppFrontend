import type { Point, Rules} from './types';
import { executeTurtleCommand, type TurtleContext } from "./turtleCommand.ts";

interface generateProps {
        axiom: string;
        rules: Rules;
        d: number;
        turnAngle: number;
        n: number;
}


// GenerateFractal_Recursive_Aux(s, ref c', R, ref P, ref φ, d, α, ref S, ref V, ref L, n)
function generateFractalRecursiveAux(
    {axiom, rules, d, turnAngle, n} : generateProps, ctx: TurtleContext ): void {
    for (const c of axiom) {
        if (n === 0 || !rules[c]) {
            executeTurtleCommand(c, ctx, d, turnAngle);
        } else {
            generateFractalRecursiveAux({axiom: rules[c], rules: rules, d: d, turnAngle: turnAngle, n: n - 1}, ctx);
        }
        ctx.prevChar = c;
    }
}

// GenerateFractal_Recursive(s, R, P, φ, d, α, n)
export function generateFractalRecursive(
    {axiom, rules, d, turnAngle, n} : generateProps, startAngle?: number ): Point[][] {

    const ctx: TurtleContext = {
        x: 0,
        y: 0,
        angle: startAngle ?? 90,
        prevChar: '',
        stack: [],
        v: [],
        l: [],
    };

    generateFractalRecursiveAux({axiom:axiom, rules: rules, d: d, turnAngle:turnAngle, n:n}, ctx);

    if (ctx.v.length > 0) {
        ctx.l.push(ctx.v);
    }
    return ctx.l;
}