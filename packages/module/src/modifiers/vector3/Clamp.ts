import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';

class Clamp extends CurveModifier<Vector3> {
    max: Vector3;
    min: Vector3;

    constructor(
      min: Vector3 | number = 0,
      max: Vector3 | number = 255,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      if (typeof min === 'number') {
        this.min = { x: min, y: min, z: min };
      } else {
        this.min = min as Vector3;
      }

      if (typeof max === 'number') {
        this.max = { x: max, y: max, z: max };
      } else {
        this.max = max as Vector3;
      }
    }

    protected _modify(value: Vector3, time: number): Vector3 {
      return {
        x: Math.min(Math.max(value.x, this.min.x), this.max.x),
        y: Math.min(Math.max(value.y, this.min.y), this.max.y),
        z: Math.min(Math.max(value.z, this.min.z), this.max.z),
      };
    }
}

export default Clamp;
