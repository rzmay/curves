import CurveModifier from '../../CurveModifier';
declare enum SineModifierBlendMode {
    Replace = 0,
    Add = 1,
    Subtract = 2,
    Multiply = 3,
    MultiplyPositive = 4
}
declare class Sine extends CurveModifier<number> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;
    blend: SineModifierBlendMode;
    constructor(blendMode?: SineModifierBlendMode, amplitude?: number, wavelength?: number, phaseOffset?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: number, time: number): number;
}
export { SineModifierBlendMode };
export default Sine;
