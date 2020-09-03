import { Easing } from 'eaz';
import Keyframe from './Keyframe';

class NumberKeyframe extends Keyframe<number> {
  interpolate(keyframe: NumberKeyframe, time: number, smoothing = 0.25): number {
    return NumberKeyframe.lerp(
      this.value,
      keyframe.value,
      Easing.interpolate(this.inEasing, keyframe.outEasing, time, smoothing),
    );
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}

export default NumberKeyframe;
