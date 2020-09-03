import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';
import { HSVColor } from '../../interfaces/HSVColor';
declare class Noise extends CurveModifier<HSVColor> {
    amplitude: number;
    frequency: number;
    simplexH: SimplexNoise;
    simplexS: SimplexNoise;
    simplexV: SimplexNoise;
    constructor(amplitude?: number, frequency?: number, seed?: number, rangeStart?: number | undefined, rangeEnd?: number | undefined);
    protected _modify(value: HSVColor, time: number): HSVColor;
}
export default Noise;
