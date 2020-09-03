import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';
import { Vector3 } from '../../interfaces/Vector3';
declare class Noise extends CurveModifier<Vector3> {
    amplitude: Vector3;
    frequency: number;
    simplexX: SimplexNoise;
    simplexY: SimplexNoise;
    simplexZ: SimplexNoise;
    constructor(amplitude?: number | Vector3, frequency?: number, seed?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: Vector3, time: number): Vector3;
}
export default Noise;
