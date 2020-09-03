import CurveModifier from '../../CurveModifier';
declare class Step extends CurveModifier<number> {
    stepLength: number;
    constructor(stepLength?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: number, time: number): number;
}
export default Step;
