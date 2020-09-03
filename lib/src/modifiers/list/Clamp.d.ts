import CurveModifier from '../../CurveModifier';
declare class Clamp extends CurveModifier<number[]> {
    max: number;
    min: number;
    constructor(min?: number, max?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: number[], time: number): number[];
    private clamp;
}
export default Clamp;
