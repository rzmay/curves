import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';
declare class Clamp extends CurveModifier<HSVColor> {
    max: HSVColor;
    min: HSVColor;
    constructor(min?: HSVColor, max?: HSVColor, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: HSVColor, time: number): HSVColor;
}
export default Clamp;
