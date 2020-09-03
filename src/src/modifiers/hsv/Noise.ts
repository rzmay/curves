import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';

class Noise extends CurveModifier<HSVColor> {
    amplitude: number;
    frequency: number;

    simplexH: SimplexNoise;
    simplexS: SimplexNoise;
    simplexV: SimplexNoise;

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

      this.simplexH = new SimplexNoise(seed.toString());
      this.simplexS = new SimplexNoise((seed + 1).toString());
      this.simplexV = new SimplexNoise((seed + 2).toString());
    }

    protected _modify(value: HSVColor, time: number): HSVColor {
      // Amplitude is scaled for saturation and value; multiply hue by 36 to preserve scale
      const noiseH = this.simplexH.noise2D(time * this.frequency, 0) * this.amplitude * 3.6;
      const noiseS = this.simplexS.noise2D(time * this.frequency, 0) * this.amplitude;
      const noiseV = this.simplexV.noise2D(time * this.frequency, 0) * this.amplitude;

      const result = {
        h: value.h + noiseH,
        s: value.s + noiseS,
        v: value.v + noiseV,
      };

      return result;
    }
}

export default Noise;
