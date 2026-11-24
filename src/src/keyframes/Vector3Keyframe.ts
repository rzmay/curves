import Keyframe from './Keyframe';
import { Vector3 } from '../interfaces/Vector3';
import NumberKeyframe, { easeTime, lerp } from './NumberKeyframe';

class Vector3Keyframe extends Keyframe<Vector3> {
  interpolate(keyframe: Vector3Keyframe, time: number): Vector3 {
    if (this.toFloatKeyframe === toFloatKeyframe && keyframe.toFloatKeyframe === toFloatKeyframe) {
      const t = easeTime(this.inEasing, keyframe.outEasing, time);
      return {
        x: lerp(this.value.x, keyframe.value.x, t),
        y: lerp(this.value.y, keyframe.value.y, t),
        z: lerp(this.value.z, keyframe.value.z, t),
      };
    }

    const floatKeyframes = this.toFloatKeyframe();
    const nextFloatKeyframes = keyframe.toFloatKeyframe();

    return {
      x: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
      y: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
      z: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
    };
  }

  toFloatKeyframe(): NumberKeyframe[] {
    return [
      new NumberKeyframe(this.time, this.value.x, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.y, this.inEasing, this.outEasing),
      new NumberKeyframe(this.time, this.value.z, this.inEasing, this.outEasing),
    ];
  }
}

const { toFloatKeyframe } = Vector3Keyframe.prototype;

export default Vector3Keyframe;
