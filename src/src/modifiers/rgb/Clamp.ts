import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';

class Clamp extends CurveModifier<RGBColor> {
    max: RGBColor;
    min: RGBColor;

    constructor(
      min: RGBColor | number = 0,
      max: RGBColor | number = 255,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      if (typeof min === 'number') {
        this.min = { r: min, g: min, b: min };
      } else {
        this.min = min as RGBColor;
      }

      if (typeof max === 'number') {
        this.max = { r: max, g: max, b: max };
      } else {
        this.max = max as RGBColor;
      }
    }

    protected _modify(value: RGBColor, time: number): RGBColor {
      return {
        r: Math.min(Math.max(value.r, this.min.r), this.max.r),
        g: Math.min(Math.max(value.g, this.min.g), this.max.g),
        b: Math.min(Math.max(value.b, this.min.b), this.max.b),
      };
    }
}

export default Clamp;
