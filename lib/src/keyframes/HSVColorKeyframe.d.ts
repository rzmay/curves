import Keyframe from './Keyframe';
import { HSVColor } from '../interfaces/HSVColor';
import NumberKeyframe from './NumberKeyframe';
declare class HSVColorKeyframe extends Keyframe<HSVColor> {
    interpolate(keyframe: HSVColorKeyframe, time: number): HSVColor;
    toFloatKeyframe(): NumberKeyframe[];
}
export default HSVColorKeyframe;
