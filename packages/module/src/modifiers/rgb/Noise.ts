import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
import SimplexNoise from 'simplex-noise';

class Noise extends CurveModifier<RGBColor> {
    amplitude: number;
    frequency: number;

    simplexR: SimplexNoise;
    simplexG: SimplexNoise;
    simplexB: SimplexNoise;

    constructor(
      amplitude = 25,
      frequency = 1,
      seed = 0,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.amplitude = amplitude;
      this.frequency = frequency;

      this.simplexR = new SimplexNoise(seed.toString());
      this.simplexG = new SimplexNoise((seed + 1).toString());
      this.simplexB = new SimplexNoise((seed + 2).toString());
    }

    protected _modify(value: RGBColor, time: number): RGBColor {
      const noiseR = this.simplexR.noise2D(time * this.frequency, 0) * this.amplitude;
      const noiseG = this.simplexG.noise2D(time * this.frequency, 0) * this.amplitude;
      const noiseB = this.simplexB.noise2D(time * this.frequency, 0) * this.amplitude;

      return {
          r: value.r + noiseR - (this.amplitude / 2),
          g: value.g + noiseG - (this.amplitude / 2),
          b: value.b + noiseB - (this.amplitude / 2),
      };
    }
}

export default Noise;
