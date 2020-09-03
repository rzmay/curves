import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';

class Step extends CurveModifier<Vector3> {
    stepLength: number;

    constructor(
      stepLength = 25,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.stepLength = stepLength;
    }

    protected _modify(value: Vector3, time: number): Vector3 {
      return {
        x: Math.floor(value.x / this.stepLength) * this.stepLength,
        y: Math.floor(value.y / this.stepLength) * this.stepLength,
        z: Math.floor(value.z / this.stepLength) * this.stepLength,
      };
    }
}

export default Step;
