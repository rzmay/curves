import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
import { SineModifierBlendMode } from '../number/Sine';


class Sine extends CurveModifier<Vector3> {
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

    protected _modify(value: Vector3, time: number): Vector3 {
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
            x: value.x * waveValue,
            y: value.y * waveValue,
            z: value.z * waveValue,
          };
        case SineModifierBlendMode.MultiplyPositive:
          return {
            x: value.x * (waveValue + this.amplitude) * 0.5,
            y: value.y * (waveValue + this.amplitude) * 0.5,
            z: value.z * (waveValue + this.amplitude) * 0.5,
          };
        default:
          addValue = 0; // Unreachable
      }

      return {
        x: value.x + addValue,
        y: value.y + addValue,
        z: value.z + addValue,
      };
    }
}

export default Sine;
