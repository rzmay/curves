import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';
import { SineModifierBlendMode } from '../number/Sine';
declare class Sine extends CurveModifier<HSVColor> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: HSVColor, time: number): HSVColor;
}
export default Sine;
