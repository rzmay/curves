import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
import { SineModifierBlendMode } from '../number/Sine';
declare class Sine extends CurveModifier<RGBColor> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: RGBColor, time: number): RGBColor;
}
export default Sine;
