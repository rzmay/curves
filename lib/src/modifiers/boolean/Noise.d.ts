import CurveModifier from '../../CurveModifier';
declare class Noise extends CurveModifier<boolean> {
    amplitude: number;
    frequency: number;
    private simplex;
    constructor(amplitude?: number, frequency?: number, seed?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: boolean, time: number): boolean;
}
export default Noise;
