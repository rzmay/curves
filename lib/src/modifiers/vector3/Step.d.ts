import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
declare class Step extends CurveModifier<Vector3> {
    stepLength: number;
    constructor(stepLength?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: Vector3, time: number): Vector3;
}
export default Step;
