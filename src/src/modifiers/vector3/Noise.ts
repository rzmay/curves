import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
import { RGBColor } from '../../interfaces/RGBColor';

class Noise extends CurveModifier<Vector3> {
    amplitude: Vector3;
    frequency: number;

    simplexX: SimplexNoise;
    simplexY: SimplexNoise;
    simplexZ: SimplexNoise;

    constructor(
      amplitude: number | Vector3 = 25,
      frequency = 1,
      seed = 0,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      if (typeof amplitude === 'number') {
        this.amplitude = { x: amplitude, y: amplitude, z: amplitude };
      } else {
        this.amplitude = amplitude as Vector3;
      }
      this.frequency = frequency;

      this.simplexX = new SimplexNoise(seed.toString());
      this.simplexY = new SimplexNoise((seed + 1).toString());
      this.simplexZ = new SimplexNoise((seed + 2).toString());
    }

    protected _modify(value: Vector3, time: number): Vector3 {
      const noiseX = this.simplexX.noise2D(time * this.frequency, 0) * this.amplitude.x;
      const noiseY = this.simplexY.noise2D(time * this.frequency, 0) * this.amplitude.y;
      const noiseZ = this.simplexZ.noise2D(time * this.frequency, 0) * this.amplitude.z;

      return {
        x: value.x + noiseX - (this.amplitude.x / 2),
        y: value.y + noiseY - (this.amplitude.y / 2),
        z: value.z + noiseZ - (this.amplitude.z / 2),
      };
    }
}

export default Noise;
