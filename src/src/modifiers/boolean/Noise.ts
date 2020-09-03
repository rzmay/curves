import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';

class Noise extends CurveModifier<boolean> {
    amplitude: number;
    frequency: number;

    private simplex: SimplexNoise;

    constructor(
      amplitude = 2,
      frequency = 1,
      seed = 0,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.amplitude = amplitude;
      this.frequency = frequency;

      this.simplex = new SimplexNoise(seed.toString());
    }

    protected _modify(value: boolean, time: number): boolean {
      const numberValue = value ? 1 : 0;
      const noiseValue = numberValue - (this.amplitude / 2) + this.simplex.noise2D(time * this.frequency, 0) * this.amplitude;
      return noiseValue > (0.5 / this.amplitude);
    }
}

export default Noise;
