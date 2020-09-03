import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import ListKeyframe from './ListKeyframe';

class StringKeyframe extends Keyframe<string> {
    protected listKeyframe: ListKeyframe;

    constructor(
      time: number,
      value: string,
      inEasing: Easing = Easing.cubic,
      outEasing: Easing | undefined = undefined,
    ) {
      super(time, value, inEasing, outEasing);

      this.listKeyframe = this.toListKeyframe();
    }

    interpolate(keyframe: StringKeyframe, time: number): string {
      return this.listKeyframe
        .interpolate(keyframe.listKeyframe, time)
        .map((n) => String.fromCharCode(Math.round(n)))
        .join('');
    }

    protected toListKeyframe(): ListKeyframe {
      const floatList = this.value.split('').map((c) => c.charCodeAt(0));
      return new ListKeyframe(this.time, floatList, this.inEasing, this.outEasing);
    }
}

export default StringKeyframe;
