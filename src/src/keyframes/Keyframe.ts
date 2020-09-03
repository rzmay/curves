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
}

export default Keyframe;
