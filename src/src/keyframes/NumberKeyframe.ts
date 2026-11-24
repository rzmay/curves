import { Easing } from 'eaz';
import Keyframe from './Keyframe';

const DEFAULT_SMOOTHING = 0.25;

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function easeTime(inEasing: Easing, outEasing: Easing, time: number, smoothing = DEFAULT_SMOOTHING): number {
  return Easing.interpolate(inEasing, outEasing, time, smoothing);
}

class NumberKeyframe extends Keyframe<number> {
  interpolate(keyframe: Keyframe<number>, time: number, smoothing = DEFAULT_SMOOTHING): number {
    return lerp(
      this.value,
      keyframe.value,
      easeTime(this.inEasing, keyframe.outEasing, time, smoothing),
    );
  }
}

export default NumberKeyframe;
