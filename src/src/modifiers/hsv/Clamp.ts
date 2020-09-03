import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';

class Clamp extends CurveModifier<HSVColor> {
    max: HSVColor;
    min: HSVColor;

    constructor(
      min: HSVColor = { h: 0, s: 0, v: 0 },
      max: HSVColor = { h: 360, s: 100, v: 100 },
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.max = max;
      this.min = min;
    }

    protected _modify(value: HSVColor, time: number): HSVColor {
      return {
        h: Math.min(Math.max(value.h, this.min.h), this.max.h),
        s: Math.min(Math.max(value.s, this.min.s), this.max.s),
        v: Math.min(Math.max(value.v, this.min.v), this.max.v),
      };
    }
}

export default Clamp;
