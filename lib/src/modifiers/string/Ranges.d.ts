import Curve, { CurveModifier } from '../../../index';
declare type range = {
    min: number;
    max: number;
};
declare class Ranges extends CurveModifier<string> {
    static CapitalAlpha: range;
    static LowercaseAlpha: range;
    static Numeric: range;
    static AlphaAccent: range;
    static NonControl: range;
    static Alpha: range[];
    static AlphaNumeric: range[];
    ranges: range[];
    clamp: boolean;
    allowKeyframeValues: boolean;
    private _whitelist;
    constructor(ranges?: range | range[], clamp?: boolean, allowKeyframeValues?: boolean, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    configure(curve: Curve<string>): void;
    protected _modify(value: string, time: number): string;
    private _isInRanges;
    private _createBoundsList;
    static createRange(min: number | string, max: number | string): range;
}
export default Ranges;
