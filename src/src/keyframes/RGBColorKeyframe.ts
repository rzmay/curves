import Keyframe from './Keyframe';
import { RGBColor } from '../interfaces/RGBColor';
import NumberKeyframe, { easeTime, lerp } from './NumberKeyframe';

class RGBColorKeyframe extends Keyframe<RGBColor> {
  interpolate(keyframe: RGBColorKeyframe, time: number): RGBColor {
    if (this.toFloatKeyframe === toFloatKeyframe && keyframe.toFloatKeyframe === toFloatKeyframe) {
      const t = easeTime(this.inEasing, keyframe.outEasing, time);
      return {
        r: lerp(this.value.r, keyframe.value.r, t),
        g: lerp(this.value.g, keyframe.value.g, t),
        b: lerp(this.value.b, keyframe.value.b, t),
      };
    }

    const floatKeyframes = this.toFloatKeyframe();
    const nextFloatKeyframes = keyframe.toFloatKeyframe();

    return {
      r: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
      g: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
      b: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
    };
  }

  toFloatKeyframe(): NumberKeyframe[] {
    return [
      new NumberKeyframe(this.time, this.value.r, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.g, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.b, this.inEasing, this.outEasing),
    ];
  }
}

const { toFloatKeyframe } = RGBColorKeyframe.prototype;

export default RGBColorKeyframe;
