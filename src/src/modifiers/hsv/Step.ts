import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';

class Step extends CurveModifier<HSVColor> {
    stepLength: number;

    constructor(
      stepLength = 25,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.stepLength = stepLength;
    }

    protected _modify(value: HSVColor, time: number): HSVColor {
      return {
        h: Math.floor(value.h / this.stepLength) * this.stepLength,
        s: Math.floor(value.s / this.stepLength) * this.stepLength,
        v: Math.floor(value.v / this.stepLength) * this.stepLength,
      };
    }
}

export default Step;
