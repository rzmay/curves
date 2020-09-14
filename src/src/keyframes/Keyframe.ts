import { Easing } from 'eaz';
import { Curve } from '../../index';

abstract class Keyframe<T> {
    time: number;
    value: T;

    inEasing: Easing;
    outEasing: Easing;

    constructor(
      time: number,
      value: T,
      inEasing: Easing = Easing.cubic,
      outEasing: Easing | undefined = undefined,
    ) {
      this.time = time;
      this.value = value;
      this.inEasing = inEasing;
      this.outEasing = outEasing ?? inEasing;
    }

    abstract interpolate(keyframe: Keyframe<T>, time: number, smoothing: number): T;

    interpolateRealtime(keyframe: Keyframe<T>, time: number, smoothing = 0.25): T {
      const alpha = (time - this.time) / (keyframe.time - this.time);
      return this.interpolate(keyframe, alpha, smoothing);
    }

    // Optional configuration for curve dependent keyframes
    configure(curve: Curve<T>) {
      // pass
    }

  // Create a custom keyframe easily without defining a subclass
  // static subclass<T>(
  //   interpolate: (thisKeyframe: KeyframeWithParams<T>, nextKeyframe: KeyframeWithParams<T>, time: number, smoothing: number) => T,
  //   configure: ((thisKeyframe: KeyframeWithParams<T>, curve: Curve<T>) => void) | undefined = undefined,
  // ): (
  //     time: number,
  //     value: T,
  //     params: object,
  //     inEasing: Easing,
  //     outEasing: Easing | undefined,
  // ) => KeyframeWithParams<T> {
  //   class Subclass extends KeyframeWithParams<T> {
  //     interpolate(keyframe: KeyframeWithParams<T>, time: number, smoothing: number): T {
  //       return interpolate(this as Subclass, keyframe, time, smoothing);
  //     }
  //
  //     configure(curve: Curve<T>) {
  //       if (configure) configure(this as Subclass, curve);
  //     }
  //   }
  //
  //   return (
  //     time: number,
  //     value: T,
  //     params: object = {},
  //     inEasing: Easing = Easing.cubic,
  //     outEasing: Easing | undefined = undefined,
  //   ) => new Subclass(time, value, params, inEasing, outEasing);
  // }
}

export default Keyframe;
