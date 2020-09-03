import Curve from './Curve';
declare abstract class CurveModifier<T> {
    rangeStart: number;
    rangeEnd: number;
    constructor(rangeStart?: number, rangeEnd?: number);
    evaluate(curve: Curve<T>, value: T, time: number): T;
    modifyExternal(value: T, time: number): T;
    configure(curve: Curve<T>): void;
    protected abstract _modify(value: T, time: number): T;
}
export default CurveModifier;
