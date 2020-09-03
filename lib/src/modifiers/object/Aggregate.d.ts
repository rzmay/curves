import { CurveModifier } from '../../../index';
import { RGBColor } from '../../interfaces/RGBColor';
declare type AggregateElements = {
    number?: CurveModifier<number>[];
    boolean?: CurveModifier<boolean>[];
    string?: CurveModifier<string>[];
    list?: CurveModifier<number[]>[];
    color?: CurveModifier<RGBColor>[];
};
declare class Aggregate extends CurveModifier<object> {
    elements: AggregateElements;
    constructor(elements: AggregateElements, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: object, time: number): object;
}
export default Aggregate;
