import CurveModifier from '../../CurveModifier';
import { RGBColor } from '../../interfaces/RGBColor';
import SimplexNoise from 'simplex-noise';
declare class Noise extends CurveModifier<RGBColor> {
    amplitude: number;
    frequency: number;
    simplexR: SimplexNoise;
    simplexG: SimplexNoise;
    simplexB: SimplexNoise;
    constructor(amplitude?: number, frequency?: number, seed?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: RGBColor, time: number): RGBColor;
}
export default Noise;
