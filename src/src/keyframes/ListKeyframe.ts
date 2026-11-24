import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe, { easeTime, lerp } from './NumberKeyframe';

class ListKeyframe extends Keyframe<number[]> {
    truncate: boolean;

    constructor(
      time: number,
      value: number[],
      inEasing: Easing = Easing.cubic,
      outEasing: Easing | undefined = undefined,
      truncate = false,
    ) {
      super(time, value, inEasing, outEasing);

      this.truncate = truncate;
    }

    interpolate(keyframe: ListKeyframe, time: number): number[] {
      if (this.toNumberKeyframes === toNumberKeyframes && keyframe.toNumberKeyframes === toNumberKeyframes) {
        const from = this.value;
        const to = keyframe.value;
        const shorter = from.length <= to.length;
        const t = easeTime(this.inEasing, keyframe.outEasing, time);
        if (this.truncate ? shorter : !shorter) {
          return from.map((value, i) => lerp(value, i in to ? to[i] : 0, t));
        }
        return to.map((value, i) => lerp(i in from ? from[i] : 0, value, t));
      }

      const numberKeyframes = this.toNumberKeyframes();
      const nextNumberKeyframes = keyframe.toNumberKeyframes();
      const defaultKeyframe = new NumberKeyframe(this.time, 0, this.inEasing, this.outEasing);
      const defaultNextKeyframe = new NumberKeyframe(keyframe.time, 0, keyframe.inEasing, keyframe.outEasing);

      const shorter = numberKeyframes.length <= nextNumberKeyframes.length;
      if (this.truncate ? shorter : !shorter) {
        return numberKeyframes.map((v, i) => v.interpolate(nextNumberKeyframes[i] ?? defaultNextKeyframe, time));
      }

      return nextNumberKeyframes.map((next, i) => (numberKeyframes[i] ?? defaultKeyframe).interpolate(next, time));
    }

    toNumberKeyframes(): NumberKeyframe[] {
      return this.value.map((v) => new NumberKeyframe(this.time, v, this.inEasing, this.outEasing));
    }
}

const { toNumberKeyframes } = ListKeyframe.prototype;

export default ListKeyframe;
