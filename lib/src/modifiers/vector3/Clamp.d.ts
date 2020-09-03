import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
declare class Clamp extends CurveModifier<Vector3> {
    max: Vector3;
    min: Vector3;
    constructor(min?: Vector3 | number, max?: Vector3 | number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: Vector3, time: number): Vector3;
}
export default Clamp;
