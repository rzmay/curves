import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
import BooleanKeyframe from './BooleanKeyframe';
import StringKeyframe from './StringKeyframe';
import { Vector3Keyframe } from '../../index';
declare class ObjectKeyframe extends Keyframe<object> {
    protected conversionMethods: {
        'number': (key: any) => Keyframe<number>;
        'string': (key: any) => Keyframe<string>;
        'boolean': (key: any) => Keyframe<boolean>;
        'object': (key: any) => Keyframe<object>;
    };
    constructor(time: number, value: object, inEasing?: Easing, outEasing?: Easing | undefined);
    interpolate(keyframe: ObjectKeyframe, time: number): object;
    protected _interpolateKey(keyframe: ObjectKeyframe, key: any, time: number): any;
    booleanKeyframe(key: any): BooleanKeyframe;
    numberKeyframe(key: any): NumberKeyframe;
    stringKeyframe(key: any): StringKeyframe;
    objectKeyframe(key: any): ObjectKeyframe;
    colorKeyframe(key: any): {
        color: Vector3Keyframe;
        alpha: NumberKeyframe;
    };
}
export default ObjectKeyframe;
