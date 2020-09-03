import Keyframe from './Keyframe';
import { HSVColor } from '../interfaces/HSVColor';
import NumberKeyframe from './NumberKeyframe';

class HSVColorKeyframe extends Keyframe<HSVColor> {
  interpolate(keyframe: HSVColorKeyframe, time: number): HSVColor {
    const floatKeyframes = this.toFloatKeyframe();
    const nextFloatKeyframes = keyframe.toFloatKeyframe();

    return {
      h: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
      s: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
      v: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
    };
  }

  toFloatKeyframe(): NumberKeyframe[] {
    return [
      new NumberKeyframe(this.time, this.value.h, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.s, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.v, this.inEasing, this.outEasing),
    ];
  }
}

export default HSVColorKeyframe;
