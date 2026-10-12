export interface Point {
    x: number;
    y: number;
}
export interface TurtleSnapshot {
    x: number;
    y: number;
    angle: number;
}
export type Rules = Record<string, string>;

export interface LSystemConfig {
    axiom: string;
    rules: Rules;
    angle: number;      // α — turning angle in degrees
    d: number;   // d — step length
    n: number; // n
    startAngle?: number;
}