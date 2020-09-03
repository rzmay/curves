import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
declare class ListKeyframe extends Keyframe<number[]> {
    truncate: boolean;
    constructor(time: number, value: number[], inEasing?: Easing, outEasing?: Easing | undefined, truncate?: boolean);
    interpolate(keyframe: ListKeyframe, time: number): number[];
    toNumberKeyframes(): NumberKeyframe[];
}
export default ListKeyframe;
