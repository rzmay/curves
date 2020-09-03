import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';
declare class Step extends CurveModifier<HSVColor> {
    stepLength: number;
    constructor(stepLength?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: HSVColor, time: number): HSVColor;
}
export default Step;
