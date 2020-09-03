import CurveModifier from '../../CurveModifier';
declare class Noise extends CurveModifier<number> {
    amplitude: number;
    frequency: number;
    private simplex;
    constructor(amplitude?: number, frequency?: number, seed?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: number, time: number): number;
}
export default Noise;
