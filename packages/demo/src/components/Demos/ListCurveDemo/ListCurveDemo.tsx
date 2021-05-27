import React, { useRef } from 'react';
import './ListCurveDemo.scss';
import { ColorHelper, Curve, HSVColor, RGBColor } from 'curves';
import CurveDemo from '../CurveDemo/CurveDemo';
import ListKeyframeValueInput from './ListKeyframeValueInput/ListKeyframeValueInput';

function ListCurveDemo(): React.ReactElement {
  function keysToCurveData(
    keys: {x: number, y: number}[],
    title: string,
    color: string,
    isKeyframe = false,
  ) {
    return {
      type: isKeyframe ? 'scatter' : 'spline',
      color,
      toolTipContent: `${title} at {x}: {y}`,
      showInLegend: isKeyframe,
      legendText: title,
      dataPoints: keys.map((key) => ({
        x: key.x,
        y: key.y,
        markerType: isKeyframe ? 'square' : 'none',
      })),
    };
  }

  function randomKey(length: number, range: number): number[] {
    const floatArray: Float32Array = new Float32Array(length).map(() => Math.floor(Math.random() * range));

    return Array.prototype.slice.call(floatArray);
  }

  const curveRef = useRef(Curve.listBuilder(randomKey(2, 5), randomKey(4, 5), 10));

  return (
    <CurveDemo <number[]>
      title="List Curve Demo"
      description="A curve constructed using ListKeyframes that can be used to animate lists of number values."
      curve={curveRef}
      valueInput={ListKeyframeValueInput}
      displayGenerator={
          (curve: Curve<number[]>, keys: { x: number, y: number[] }[]) => {
            const curves: { x: number, y: number }[][] = [];
            keys.forEach((key) => {
              key.y.forEach((value, index) => {
                if (index >= curves.length) {
                  curves.push([]);
                }

                curves[index].push({ x: key.x, y: value });
              });
            });

            const keyframeCurves: { x: number, y: number }[][] = [];
            curve.keys.forEach((key) => {
              key.value.forEach((value, index) => {
                if (index >= keyframeCurves.length) {
                  keyframeCurves.push([]);
                }

                keyframeCurves[index].push({ x: key.time, y: value });
              });
            });

            const data: any[] = [];
            curves.forEach((value, index) => {
              const color: HSVColor = { h: index * (360 / curves.length), s: 100, v: 100 };
              const rgbColor: RGBColor = ColorHelper.HSVtoRGB(color);
              data.push(
                keysToCurveData(
                  value,
                  `Index ${index}`,
                  `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
                ),
              );

              data.push(
                keysToCurveData(
                  keyframeCurves[index],
                  `Index ${index}`,
                  `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b})`,
                  true,
                ),
              );
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
              },
              axisX: {
                title: 'Time',
                interval: 1,
              },
              data,
            };
          }
      }
    />
  );
}

export default ListCurveDemo;
