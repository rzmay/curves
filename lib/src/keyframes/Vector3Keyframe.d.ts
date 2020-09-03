import Keyframe from './Keyframe';
import { Vector3 } from '../interfaces/Vector3';
import NumberKeyframe from './NumberKeyframe';
declare class Vector3Keyframe extends Keyframe<Vector3> {
    interpolate(keyframe: Vector3Keyframe, time: number): Vector3;
    toFloatKeyframe(): NumberKeyframe[];
}
export default Vector3Keyframe;
