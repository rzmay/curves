import convert from 'color-convert';
function normalizeHSV(color) {
    var modHue = color.h % 360;
    if (modHue < 0)
        modHue = 360 + modHue;
    return {
        h: modHue,
        s: Math.min(Math.max(color.s, 0), 100),
        v: Math.min(Math.max(color.v, 0), 100),
    };
}
function HSVtoRGB(color) {
    var hsv = normalizeHSV(color);
    var rgbList = convert.hsv.rgb(hsv.h, hsv.s, hsv.v);
    return { r: rgbList[0], g: rgbList[1], b: rgbList[2] };
}
function HSLtoRGB(color) {
    var hsl = normalizeHSV(color);
    var rgbList = convert.hsl.rgb(hsl.h, hsl.s, hsl.v);
    return { r: rgbList[0], g: rgbList[1], b: rgbList[2] };
}
function HSVtoHSL(color) {
    var hsv = normalizeHSV(color);
    var hslList = convert.hsv.hls(hsv.h, hsv.s, hsv.v);
    return { h: hslList[0], s: hslList[1], v: hslList[2] };
}
function HSLtoHSV(color) {
    var hsl = normalizeHSV(color);
    var hsvList = convert.hsl.hsv(hsl.h, hsl.s, hsl.v);
    return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}
function RGBtoHSV(color) {
    var hsvList = convert.rgb.hsv(color.r, color.g, color.b);
    return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}
function RGBtoHSL(color) {
    var hsvList = convert.rgb.hsl(color.r, color.g, color.b);
    return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}
var ColorHelper = {
    normalizeHSV: normalizeHSV,
    HSVtoRGB: HSVtoRGB,
    HSLtoRGB: HSLtoRGB,
    HSVtoHSL: HSVtoHSL,
    HSLtoHSV: HSLtoHSV,
    RGBtoHSV: RGBtoHSV,
    RGBtoHSL: RGBtoHSL,
};
export default ColorHelper;
