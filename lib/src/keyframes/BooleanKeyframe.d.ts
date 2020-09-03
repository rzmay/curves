import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
declare class BooleanKeyframe extends Keyframe<boolean> {
    solveInterpolation: boolean;
    truthThreshold: number;
    constructor(time: number, value: boolean, inEasing?: Easing, outEasing?: Easing | undefined, solveInterpolation?: boolean, truthThreshold?: number);
    interpolate(keyframe: BooleanKeyframe, time: number): boolean;
    protected numberKeyframe(): NumberKeyframe;
}
export default BooleanKeyframe;
