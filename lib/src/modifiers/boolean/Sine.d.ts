import CurveModifier from '../../CurveModifier';
import { SineModifierBlendMode } from '../number/Sine';
declare class Sine extends CurveModifier<boolean> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: boolean, time: number): boolean;
    private _modifyNumber;
}
export { SineModifierBlendMode };
export default Sine;
