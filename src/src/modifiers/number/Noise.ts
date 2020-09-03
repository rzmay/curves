import CurveModifier from '../../CurveModifier';
import SimplexNoise from 'simplex-noise';

class Noise extends CurveModifier<number> {
    amplitude: number;
    frequency: number;

    private simplex: SimplexNoise;

    constructor(
      amplitude = 0.1,
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

    protected _modify(value: number, time: number): number {
      return value - (this.amplitude / 2) + this.simplex.noise2D(time * this.frequency, 0) * this.amplitude;
    }
}

export default Noise;
