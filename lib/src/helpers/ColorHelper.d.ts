import { HSVColor } from '../interfaces/HSVColor';
import { RGBColor } from '../interfaces/RGBColor';
declare function normalizeHSV(color: HSVColor): HSVColor;
declare function HSVtoRGB(color: HSVColor): RGBColor;
declare function HSLtoRGB(color: HSVColor): RGBColor;
declare function HSVtoHSL(color: HSVColor): HSVColor;
declare function HSLtoHSV(color: HSVColor): HSVColor;
declare function RGBtoHSV(color: RGBColor): HSVColor;
declare function RGBtoHSL(color: RGBColor): HSVColor;
declare const ColorHelper: {
    normalizeHSV: typeof normalizeHSV;
    HSVtoRGB: typeof HSVtoRGB;
    HSLtoRGB: typeof HSLtoRGB;
    HSVtoHSL: typeof HSVtoHSL;
    HSLtoHSV: typeof HSLtoHSV;
    RGBtoHSV: typeof RGBtoHSV;
    RGBtoHSL: typeof RGBtoHSL;
};
export default ColorHelper;
