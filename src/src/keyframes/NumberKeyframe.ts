import { Easing } from 'eaz';
import Keyframe from './Keyframe';

class NumberKeyframe extends Keyframe<number> {
  interpolate(keyframe: Keyframe<number>, time: number, smoothing = 0.25): number {
    const inEasing = (this.time < keyframe.time) ? this.inEasing : keyframe.inEasing;
    const outEasing = (this.time < keyframe.time) ? keyframe.outEasing : this.outEasing;

    return NumberKeyframe.lerp(
      this.value,
      keyframe.value,
      Easing.interpolate(inEasing, outEasing, time, smoothing),
    );
  }

  private static lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }
}

export default NumberKeyframe;
