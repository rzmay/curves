import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
declare class Step extends CurveModifier<RGBColor> {
    stepLength: number;
    constructor(stepLength?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: RGBColor, time: number): RGBColor;
}
export default Step;
