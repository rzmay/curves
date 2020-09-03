import { Easing } from 'eaz';
import { Curve } from '../../index';
declare abstract class Keyframe<T> {
    time: number;
    value: T;
    inEasing: Easing;
    outEasing: Easing;
    constructor(time: number, value: T, inEasing?: Easing, outEasing?: Easing | undefined);
    abstract interpolate(keyframe: Keyframe<T>, time: number, smoothing: number): T;
    interpolateRealtime(keyframe: Keyframe<T>, time: number, smoothing?: number): T;
    configure(curve: Curve<T>): void;
}
export default Keyframe;
