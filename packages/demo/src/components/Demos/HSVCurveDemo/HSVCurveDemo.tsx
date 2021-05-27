import React, { useRef, useState } from 'react';
import { ColorHelper, Curve, HSVColor } from 'curves';
import CurveDemo from '../CurveDemo/CurveDemo';
import TitledColorBar from '../../ColorBar/TitledColorBar/TitledColorBar';
import HSVColorKeyframeValueInput from './HSVColorKeyframeValueInput/HSVColorKeyframeValueInput';
import './HSVCurveDemo.scss';

type dataPoint = {
  x: number;
  y: number;
  lineColor?: string;
  markerColor: string;
  markerType: string;
  markerBorderColor?: string;
  markerBorderThickness?: number;
};

type hsvKeys = {
  h: dataPoint[];
  s: dataPoint[];
  v: dataPoint[];
};

function HSVCurveDemo(): React.ReactElement {
  const [colorBarKeys, setColorBarKeys] = useState([
    { color: { r: 0, g: 0, b: 0 }, time: 0 },
    { color: { r: 255, g: 0, b: 0 }, time: 1 },
  ]);
  const [hslColorBarKeys, setHSLColorBarKeys] = useState([
    { color: { r: 0, g: 0, b: 0 }, time: 0 },
    { color: { r: 0, g: 255, b: 0 }, time: 1 },
  ]);

  const curveRef = useRef(Curve.hsvColorBuilder(
    { h: 0, s: 100, v: 50 },
    { h: 360, s: 40, v: 100 },
    10,
  ));

  return (
    <CurveDemo<HSVColor>
      title="HSV Color Curve Demo"
      description="A curve constructed using HSVColorKeyframes that can be used to animate color values."
      valueInput={HSVColorKeyframeValueInput}
      curve={curveRef}
      displayGenerator={
          (curve: Curve<HSVColor>, keys: { x: number, y: HSVColor }[]) => {
            setColorBarKeys(keys.map((key) => ({
              color: ColorHelper.HSVtoRGB(key.y),
              time: key.x / (curve.duration + curve.startTime),
            })));
            setHSLColorBarKeys(keys.map((key) => ({
              color: ColorHelper.HSLtoRGB(key.y),
              time: key.x / (curve.duration + curve.startTime),
            })));

            const colorKeys: hsvKeys = {
              h: [],
              s: [],
              v: [],
            };

            const keyframeColorKeys: hsvKeys = {
              h: [],
              s: [],
              v: [],
            };

            const valueLimit = 0.95; // Limit value (on value curve color) so that curve is visible
            keys.forEach((key) => {
              const hueColor = `hsl(${key.y.h}, 100%, 50%)`;
              const saturationColor = `hsl(0, ${key.y.s}%, 50%)`;
              const valueColor = `hsl(0, 0%, ${key.y.v * valueLimit}%)`;

              colorKeys.h.push({ x: key.x, y: key.y.h, lineColor: hueColor, markerColor: hueColor, markerType: 'none' });
              colorKeys.s.push({ x: key.x, y: key.y.s, lineColor: saturationColor, markerColor: saturationColor, markerType: 'none' });
              colorKeys.v.push({ x: key.x, y: key.y.v, lineColor: valueColor, markerColor: valueColor, markerType: 'none' });
            });

            curve.keys.forEach((key) => {
              const hueColor = `hsl(${key.value.h}, 100%, 50%)`;
              const saturationColor = `hsl(0, ${key.value.s}%, 50%)`;
              const valueColor = `hsl(0, 0%, ${key.value.v}%)`;

              keyframeColorKeys.h.push({ x: key.time, y: key.value.h, markerColor: hueColor, markerType: 'square' });
              keyframeColorKeys.s.push({ x: key.time, y: key.value.s, markerColor: saturationColor, markerType: 'square' });
              keyframeColorKeys.v.push({
                x: key.time,
                y: key.value.v,
                markerColor: valueColor,
                markerType: 'square',
                markerBorderColor: 'gray',
                markerBorderThickness: 1,
              });
            });

            return {
              animationEnabled: true,
              theme: 'light2',
              title: {
                text: 'Curve Test',
              },
              axisY: {
                title: 'Saturation & Value',
                suffix: '%',
                minimum: 0,
              },
              axisY2: {
                title: 'Hue',
                suffix: 'º',
                minimum: 0,
              },
              axisX: {
                title: 'Time',
                interval: 1,
              },
              data: [
                {
                  type: 'spline',
                  toolTipContent: 'Saturation {x}: {y}',
                  dataPoints: colorKeys.s,
                },
                {
                  type: 'scatter',
                  toolTipContent: 'Saturation {x}: {y}',
                  dataPoints: keyframeColorKeys.s,
                },
                {
                  type: 'spline',
                  toolTipContent: 'Value {x}: {y}',
                  dataPoints: colorKeys.v,
                },
                {
                  type: 'scatter',
                  toolTipContent: 'Value {x}: {y}',
                  dataPoints: keyframeColorKeys.v,
                },
                {
                  type: 'spline',
                  toolTipContent: 'Hue {x}: {y}',
                  axisYType: 'secondary',
                  dataPoints: colorKeys.h,
                },
                {
                  type: 'scatter',
                  toolTipContent: 'Value {x}: {y}',
                  axisYType: 'secondary',
                  dataPoints: keyframeColorKeys.h,
                },
              ],
            };
          }
        }
    >
      <TitledColorBar colors={colorBarKeys} title="HSV" />
      <TitledColorBar colors={hslColorBarKeys} title="HSL" />
    </CurveDemo>
  );
}

export default HSVCurveDemo;
