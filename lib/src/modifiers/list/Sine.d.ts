import CurveModifier from '../../CurveModifier';
import { SineModifierBlendMode } from '../number/Sine';
declare class Sine extends CurveModifier<number[]> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: number[], time: number): number[];
    private _modifySingle;
}
export default Sine;
