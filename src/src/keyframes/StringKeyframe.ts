import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import ListKeyframe from './ListKeyframe';
import { easeTime, lerp } from './NumberKeyframe';

class StringKeyframe extends Keyframe<string> {
  private static readonly defaultToListKeyframe = StringKeyframe.prototype.toListKeyframe;

  constructor(
    time: number,
    value: string,
    inEasing: Easing = Easing.cubic,
    outEasing: Easing | undefined = undefined,
  ) {
    super(time, value, inEasing, outEasing);
  }

  interpolate(keyframe: StringKeyframe, time: number): string {
    if (this.toListKeyframe === StringKeyframe.defaultToListKeyframe
        && keyframe.toListKeyframe === StringKeyframe.defaultToListKeyframe) {
      const from = this.value;
      const to = keyframe.value;
      const length = Math.max(from.length, to.length);
      const t = easeTime(this.inEasing, keyframe.outEasing, time);
      let result = '';
      for (let i = 0; i < length; i += 1) {
        const a = i < from.length ? from.charCodeAt(i) : 0;
        const b = i < to.length ? to.charCodeAt(i) : 0;
        result += String.fromCharCode(Math.round(lerp(a, b, t)));
      }
      return result;
    }

    return this.toListKeyframe()
      .interpolate(keyframe.toListKeyframe(), time)
      .map((n) => String.fromCharCode(Math.round(n)))
      .join('');
  }

  protected toListKeyframe(): ListKeyframe {
    const floatList = this.value.split('').map((c) => c.charCodeAt(0));
    return new ListKeyframe(this.time, floatList, this.inEasing, this.outEasing);
  }
}

export default StringKeyframe;
