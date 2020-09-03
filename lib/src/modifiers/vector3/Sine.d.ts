import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
import { SineModifierBlendMode } from '../number/Sine';
declare class Sine extends CurveModifier<Vector3> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: Vector3, time: number): Vector3;
}
export default Sine;
