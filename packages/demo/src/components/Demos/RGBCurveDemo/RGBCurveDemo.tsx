import React, { useRef, useState } from 'react';
import { Curve, RGBColor } from 'curves';
import CurveDemo from '../CurveDemo/CurveDemo';
import ColorBar from '../../ColorBar/ColorBar';
import RGBColorKeyframeValueInput from './RGBColorKeyframeValueInput/RGBColorKeyframeValueInput';
import './RGBCurveDemo.scss';

function RGBCurveDemo(): React.ReactElement {
  const [colorBarKeys, setColorBarKeys] = useState([
    { color: { r: 0, g: 0, b: 0 }, time: 0 },
    { color: { r: 255, g: 0, b: 0 }, time: 1 },
  ]);

  const curveRef = useRef(Curve.rgbColorBuilder(
    { r: 255, g: 200, b: 0 },
    { r: 0, g: 180, b: 220 },
    10,
  ));

  return (
    <CurveDemo <RGBColor>
      title="RGB Color Curve Demo"
      description="A curve constructed using RGBColorKeyframes that can be used to animate color values."
      valueInput={RGBColorKeyframeValueInput}
      curve={curveRef}
      displayGenerator={
          (curve: Curve<RGBColor>, keys: { x: number, y: RGBColor }[]) => {
            setColorBarKeys(keys.map((key) => ({
              color: key.y,
              time: key.x / (curve.duration + curve.startTime),
            })));

            const colorKeys: {
                r: { x: number, y: number }[],
                g: { x: number, y: number }[],
                b: { x: number, y: number }[],
            } = {
              r: [],
              g: [],
              b: [],
            };

            keys.forEach((key) => {
              colorKeys.r.push({ x: key.x, y: key.y.r });
              colorKeys.g.push({ x: key.x, y: key.y.g });
              colorKeys.b.push({ x: key.x, y: key.y.b });
            });

            return {
              animationEnabled: true,
              theme: 'light2',
              title: {
                text: 'Curve Test',
              },
              axisY: {
                title: 'Value',
                includeZero: false,
                maximum: 255,
              },
              axisX: {
                title: 'Time',
                interval: 1,
              },
              data: [
                {
                  type: 'spline',
                  color: '#ff0000',
                  toolTipContent: 'Red {x}: {y}',
                  dataPoints: colorKeys.r.map((key) => ({
                    x: key.x,
                    y: key.y,
                    markerType: 'none',
                  })),
                },
                {
                  type: 'scatter',
                  color: '#ff0000',
                  toolTipContent: 'Red {x}: {y}',
                  dataPoints: curve.keys.map((key) => ({
                    x: key.time,
                    y: key.value.r,
                    markerType: 'square',
                  })),
                },
                {
                  type: 'spline',
                  color: '#00ff00',
                  toolTipContent: 'Green {x}: {y}',
                  dataPoints: colorKeys.g.map((key) => ({
                    x: key.x,
                    y: key.y,
                    markerType: 'none',
                  })),
                },
                {
                  type: 'scatter',
                  color: '#00ff00',
                  toolTipContent: 'Green {x}: {y}',
                  dataPoints: curve.keys.map((key) => ({
                    x: key.time,
                    y: key.value.g,
                    markerType: 'square',
                  })),
                },
                {
                  type: 'spline',
                  color: '#0000ff',
                  toolTipContent: 'Blue {x}: {y}',
                  dataPoints: colorKeys.b.map((key) => ({
                    x: key.x,
                    y: key.y,
                    markerType: 'none',
                  })),
                },
                {
                  type: 'scatter',
                  color: '#0000ff',
                  toolTipContent: 'Blue {x}: {y}',
                  dataPoints: curve.keys.map((key) => ({
                    x: key.time,
                    y: key.value.b,
                    markerType: 'square',
                  })),
                },
              ],
            };
          }
      }
    >
      <ColorBar colors={colorBarKeys} />
    </CurveDemo>
  );
}

export default RGBCurveDemo;
