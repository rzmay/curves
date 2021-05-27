import convert from 'color-convert';
import { HSVColor } from '../interfaces/HSVColor';
import { RGBColor } from '../interfaces/RGBColor';

function normalizeHSV(color: HSVColor): HSVColor {
  let modHue = color.h % 360;
  if (modHue < 0) modHue = 360 + modHue;

  return {
    h: modHue,
    s: Math.min(Math.max(color.s, 0), 100),
    v: Math.min(Math.max(color.v, 0), 100),
  };
}

function HSVtoRGB(color: HSVColor): RGBColor {
  const hsv = normalizeHSV(color);
  const rgbList = convert.hsv.rgb(hsv.h, hsv.s, hsv.v);
  return { r: rgbList[0], g: rgbList[1], b: rgbList[2] };
}

function HSLtoRGB(color: HSVColor): RGBColor {
  const hsl = normalizeHSV(color);
  const rgbList = convert.hsl.rgb(hsl.h, hsl.s, hsl.v);
  return { r: rgbList[0], g: rgbList[1], b: rgbList[2] };
}

function HSVtoHSL(color: HSVColor): HSVColor {
  const hsv = normalizeHSV(color);
  const hslList = convert.hsv.hls(hsv.h, hsv.s, hsv.v);
  return { h: hslList[0], s: hslList[1], v: hslList[2] };
}

function HSLtoHSV(color: HSVColor): HSVColor {
  const hsl = normalizeHSV(color);
  const hsvList = convert.hsl.hsv(hsl.h, hsl.s, hsl.v);
  return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}

function RGBtoHSV(color: RGBColor): HSVColor {
  const hsvList = convert.rgb.hsv(color.r, color.g, color.b);
  return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}

function RGBtoHSL(color: RGBColor): HSVColor {
  const hsvList = convert.rgb.hsl(color.r, color.g, color.b);
  return { h: hsvList[0], s: hsvList[1], v: hsvList[2] };
}

const ColorHelper = {
  normalizeHSV,
  HSVtoRGB,
  HSLtoRGB,
  HSVtoHSL,
  HSLtoHSV,
  RGBtoHSV,
  RGBtoHSL,
};

export default ColorHelper;
