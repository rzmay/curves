import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';

class Step extends CurveModifier<RGBColor> {
    stepLength: number;

    constructor(
      stepLength = 25,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.stepLength = stepLength;
    }

    protected _modify(value: RGBColor, time: number): RGBColor {
      return {
        r: Math.floor(value.r / this.stepLength) * this.stepLength,
        g: Math.floor(value.g / this.stepLength) * this.stepLength,
        b: Math.floor(value.b / this.stepLength) * this.stepLength,
      };
    }
}

export default Step;
