import Keyframe from './Keyframe';
import { RGBColor } from '../interfaces/RGBColor';
import NumberKeyframe from './NumberKeyframe';
declare class RGBColorKeyframe extends Keyframe<RGBColor> {
    interpolate(keyframe: RGBColorKeyframe, time: number): RGBColor;
    toFloatKeyframe(): NumberKeyframe[];
}
export default RGBColorKeyframe;
