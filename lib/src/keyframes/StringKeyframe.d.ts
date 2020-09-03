import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import ListKeyframe from './ListKeyframe';
declare class StringKeyframe extends Keyframe<string> {
    protected listKeyframe: ListKeyframe;
    constructor(time: number, value: string, inEasing?: Easing, outEasing?: Easing | undefined);
    interpolate(keyframe: StringKeyframe, time: number): string;
    protected toListKeyframe(): ListKeyframe;
}
export default StringKeyframe;
