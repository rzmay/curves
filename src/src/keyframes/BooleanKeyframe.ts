import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';

class BooleanKeyframe extends Keyframe<boolean> {
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
