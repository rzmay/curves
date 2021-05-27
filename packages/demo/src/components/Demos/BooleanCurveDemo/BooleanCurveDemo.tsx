import React, { useRef } from 'react';
import './BooleanCurveDemo.scss';
import { Curve, BooleanKeyframe } from 'curves';
import CurveDemo from '../CurveDemo/CurveDemo';
import BooleanKeyframeValueInput from './BooleanKeyframeValueInput/BooleanKeyframeValueInput';

function BooleanCurveDemo(): React.ReactElement {
  const curveRef = useRef(new Curve<boolean>([
    new BooleanKeyframe(0, false),
    new BooleanKeyframe(5, true),
    new BooleanKeyframe(10, false),
  ]));

  return (
    <CurveDemo <boolean>
      title="Boolean Curve Demo"
      description="A curve constructed using StringKeyframes that can be used to animate string values."
      valueInput={BooleanKeyframeValueInput}
      curve={curveRef}
      displayGenerator={
          (curve: Curve<boolean>, keys: { x: number, y: boolean }[]) => ({
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
            data: [
              {
                type: 'line',
                toolTipContent: 'Time {x}: {bool}',
                dataPoints: keys.map((key) => ({
                  x: key.x,
                  y: key.y ? 1 : 0,
                  markerType: 'none',
                  bool: key.y,
                })),
              },
              {
                type: 'scatter',
                toolTipContent: 'Time {x}: {bool}',
                dataPoints: curve.keys.map((key) => ({
                  x: key.time,
                  y: key.value ? 1 : 0,
                  color: 'lightblue',
                  bool: key.value,
                })),
              },
            ],
          })
      }
    />
  );
}

export default BooleanCurveDemo;
