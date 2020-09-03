import Keyframe from './Keyframe';
import { Curve } from '../../index';
declare class BezierHandle {
    angle: number;
    magnitude: number;
    constructor(angle: number, magnitude?: number);
    toCartesian(origin: {
        x: number;
        y: number;
    }): {
        x: number;
        y: number;
    };
    fromCartesian(origin: {
        x: number;
        y: number;
    }, coordinates: {
        x: number;
        y: number;
    }): void;
}
declare class BezierKeyframe extends Keyframe<number> {
    inHandle: BezierHandle;
    outHandle: BezierHandle;
    automaticHandles: boolean;
    defaultMagnitude: number;
    constructor(time: number, value: number, inHandle?: BezierHandle | undefined, outHandle?: BezierHandle | undefined, defaultMagnitude?: number);
    configure(curve: Curve<number>): void;
    interpolate(keyframe: BezierKeyframe | Keyframe<number>, time: number, smoothing?: number): number;
    private _restrictHandles;
    static automatic(time: number, value: number, magnitude?: number): BezierKeyframe;
    private static _evaluateY;
}
export default BezierKeyframe;
export { BezierHandle };
