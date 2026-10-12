import type { LSystemConfig } from './types';

export const PRESETS: Record<string, LSystemConfig> = {
    kochCurve: {
        axiom: 'F',
        rules: { F: 'F-F++F-F' },
        angle: 60,
        d: 10,
        n: 4,
        startAngle: 0,
    },
    kochSnowflake: {
        axiom: 'F--F--F',
        rules: { F: 'F+F--F+F' },
        angle: 60,
        d: 10,
        n: 4,
        startAngle: 0,
    },
    sierpinskiTriangle: {
        axiom: 'F-G-G',
        rules: { F: 'F-G+F+G-F', G: 'GG' },
        angle: 120,
        d: 10,
        n: 5,
        startAngle: 0,
    },
    dragonCurve: {
        axiom: 'F',
        rules: { F: 'F+G', G: 'F-G' },
        angle: 90,
        d: 8,
        n: 10,
        startAngle: 0,
    },
    plant: {
        axiom: 'X',
        rules: { X: 'F+[[X]-X]-F[-FX]+X', F: 'FF' },
        angle: 25,
        d: 5,
        n: 5,
        startAngle: -90,
    },
    sierpinskiCarpet: {
        axiom: 'F',
        rules: {
            F: 'F+F-F-F-F+F+F+F-F'
        },
        angle: 90,
        d: 6,
        n: 4,
        startAngle: 0,
    },
};