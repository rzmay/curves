import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe, { easeTime, lerp } from './NumberKeyframe';

class BooleanKeyframe extends Keyframe<boolean> {
    private static readonly defaultNumberKeyframe = BooleanKeyframe.prototype.numberKeyframe;

    solveInterpolation: boolean;
    truthThreshold: number;

    constructor(
      time: number,
      value: boolean,
      inEasing: Easing = Easing.cubic,
      outEasing: Easing | undefined = undefined,
      solveInterpolation = false,
      truthThreshold = 0.5,
    ) {
      super(time, value, inEasing, outEasing);

      this.solveInterpolation = solveInterpolation;
      this.truthThreshold = truthThreshold;
    }

    interpolate(keyframe: BooleanKeyframe, time: number): boolean {
      if (this.solveInterpolation) {
        if (this.numberKeyframe === BooleanKeyframe.defaultNumberKeyframe
            && keyframe.numberKeyframe === BooleanKeyframe.defaultNumberKeyframe) {
          const t = easeTime(this.inEasing, keyframe.outEasing, time);
          return lerp(this.value ? 1 : 0, keyframe.value ? 1 : 0, t) > this.truthThreshold;
        }
        const value = this.numberKeyframe().interpolate(keyframe.numberKeyframe(), time);
        return value > this.truthThreshold;
      }
      return this.value;
    }

    protected numberKeyframe(): NumberKeyframe {
      return new NumberKeyframe(this.time, (this.value ? 1 : 0), this.inEasing, this.outEasing);
    }
}

export default BooleanKeyframe;
