import Keyframe from './Keyframe';
import { Vector3 } from '../interfaces/Vector3';
import NumberKeyframe from './NumberKeyframe';

class Vector3Keyframe extends Keyframe<Vector3> {
  interpolate(keyframe: Vector3Keyframe, time: number): Vector3 {
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

export default Vector3Keyframe;
