import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
declare class Clamp extends CurveModifier<RGBColor> {
    max: RGBColor;
    min: RGBColor;
    constructor(min?: RGBColor | number, max?: RGBColor | number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: RGBColor, time: number): RGBColor;
}
export default Clamp;
