import Keyframe from './Keyframe';
declare class NumberKeyframe extends Keyframe<number> {
    interpolate(keyframe: NumberKeyframe, time: number, smoothing?: number): number;
    private static lerp;
}
export default NumberKeyframe;
