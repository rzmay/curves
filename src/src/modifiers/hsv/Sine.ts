import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';
import { SineModifierBlendMode } from '../number/Sine';


class Sine extends CurveModifier<HSVColor> {
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

    protected _modify(value: HSVColor, time: number): HSVColor {
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
            h: value.h * 3.6 * waveValue,
            s: value.s * waveValue,
            v: value.s * waveValue,
          };
        case SineModifierBlendMode.MultiplyPositive:
          return {
            h: value.h * 3.6 * (waveValue + this.amplitude) / 2,
            s: value.s * (waveValue + this.amplitude) / 2,
            v: value.v * (waveValue + this.amplitude) / 2,
          };
        default:
          addValue = 0; // Unreachable
      }

      return {
        h: value.h + addValue * 3.6,
        s: value.s + addValue,
        v: value.v + addValue,
      };
    }
}

export default Sine;
