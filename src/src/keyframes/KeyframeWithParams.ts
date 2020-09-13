import { Easing } from 'eaz';
import Keyframe from './Keyframe';

abstract class KeyframeWithParams<T> extends Keyframe<T> {
    params: object

    constructor(
      time: number,
      value: T,
      params: object = {},
      inEasing: Easing = Easing.cubic,
      outEasing: Easing | undefined = undefined,
    ) {
      super(time, value, inEasing, outEasing);
      this.params = params;
    }
}

export default KeyframeWithParams;
