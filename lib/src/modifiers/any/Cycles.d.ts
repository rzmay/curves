import CurveModifier from '../../CurveModifier';
import { Curve } from '../../../index';
declare class Cycles<T> extends CurveModifier<T> {
    startTime: number;
    endTime: number;
    private _curve;
    constructor(startTime?: number, endTime?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    configure(curve: Curve<T>): void;
    protected _modify(value: T, time: number): T;
}
export default Cycles;
