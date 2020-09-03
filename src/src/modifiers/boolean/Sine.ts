import CurveModifier from '../../CurveModifier';
import { SineModifierBlendMode } from '../number/Sine';

class Sine extends CurveModifier<boolean> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;

    blend: SineModifierBlendMode;

    constructor(
      blendMode = SineModifierBlendMode.Replace,
      amplitude = 0.75,
      wavelength = 1,
      phaseOffset = 0,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.amplitude = amplitude;
      this.wavelength = wavelength;
      this.phaseOffset = phaseOffset;

      this.blend = blendMode;
    }

    protected _modify(value: boolean, time: number): boolean {
      return this._modifyNumber(value, time) > 0.5;
    }

    private _modifyNumber(value: boolean, time: number): number {
      const numberValue = value ? 1 : 0;
      const waveValue = Math.sin(
        (time - this.phaseOffset)
            * 2 * Math.PI * (1 / this.wavelength),
      ) * this.amplitude;

      switch (this.blend) {
        case SineModifierBlendMode.Replace:
          return numberValue + waveValue;
        case SineModifierBlendMode.Add:
          return numberValue + waveValue + (0.5 * this.amplitude);
        case SineModifierBlendMode.Subtract:
          return numberValue + waveValue - (0.5 * this.amplitude);
        case SineModifierBlendMode.Multiply:
          return numberValue * waveValue;
        case SineModifierBlendMode.MultiplyPositive:
          return numberValue * (waveValue + this.amplitude) / 2;
        default:
          return numberValue; // Unreachable
      }
    }
}

export { SineModifierBlendMode };
export default Sine;
