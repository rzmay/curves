import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
import { SineModifierBlendMode } from '../number/Sine';


class Sine extends CurveModifier<RGBColor> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;

    blend: SineModifierBlendMode;

    constructor(
      blendMode = SineModifierBlendMode.Replace,
      amplitude = 10,
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

    protected _modify(value: RGBColor, time: number): RGBColor {
      const waveValue = Math.sin(
        (time - this.phaseOffset)
            * 2 * Math.PI * (1 / this.wavelength),
      ) * this.amplitude;

      let addValue = 0;

      switch (this.blend) {
        case SineModifierBlendMode.Replace:
          addValue = waveValue;
          break;
        case SineModifierBlendMode.Add:
          addValue = waveValue + (0.5 * this.amplitude);
          break;
        case SineModifierBlendMode.Subtract:
          addValue = waveValue - (0.5 * this.amplitude);
          break;
        case SineModifierBlendMode.Multiply:
          return {
            r: value.r * waveValue,
            g: value.g * waveValue,
            b: value.b * waveValue,
          };
        case SineModifierBlendMode.MultiplyPositive:
          return {
            r: value.r * (waveValue + this.amplitude) / 2,
            g: value.g * (waveValue + this.amplitude) / 2,
            b: value.b * (waveValue + this.amplitude) / 2,
          };
        default:
          addValue = 0; // Unreachable
      }

      return {
        r: value.r + addValue,
        g: value.g + addValue,
        b: value.b + addValue,
      };
    }
}

export default Sine;
