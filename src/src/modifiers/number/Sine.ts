import CurveModifier from '../../CurveModifier';

enum SineModifierBlendMode {
    Replace,
    Add,
    Subtract,
    Multiply,
    MultiplyPositive,
}

class Sine extends CurveModifier<number> {
    amplitude: number;
    wavelength: number;
    phaseOffset: number;

    blend: SineModifierBlendMode;

    constructor(
      blendMode = SineModifierBlendMode.Replace,
      amplitude = 0.1,
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

    protected _modify(value: number, time: number): number {
      const waveValue = Math.sin(
        (time - this.phaseOffset)
            * 2 * Math.PI * (1 / this.wavelength),
      ) * this.amplitude;

      switch (this.blend) {
        case SineModifierBlendMode.Replace:
          return value + waveValue;
        case SineModifierBlendMode.Add:
          return value + waveValue + (0.5 * this.amplitude);
        case SineModifierBlendMode.Subtract:
          return value + waveValue - (0.5 * this.amplitude);
        case SineModifierBlendMode.Multiply:
          return value * waveValue;
        case SineModifierBlendMode.MultiplyPositive:
          return value * (waveValue + this.amplitude) / 2;
        default:
          return value; // Unreachable
      }
    }
}

export { SineModifierBlendMode };
export default Sine;
