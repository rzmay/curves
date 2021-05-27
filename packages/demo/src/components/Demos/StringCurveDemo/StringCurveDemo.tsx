import React, { useRef } from 'react';
import './StringCurveDemo.scss';
import { Curve, Modifiers } from 'curves';
import SecondaryStringDisplay from './SecondaryStringDisplay/SecondaryStringDisplay';
import CurveDemo from '../CurveDemo/CurveDemo';
import StringKeyframeValueInput from './StringKeyframeValueInput/StringKeyframeValueInput';

function StringCurveDemo(): React.ReactElement {
  const demoCurve = Curve.stringBuilder('Hello World!', 'Robert May', 10);
  const curveRef = useRef(demoCurve);

  function stringToVal(str: string) {
    return str.split('')
      .map((char) => char.charCodeAt(0))
      .reduce((accumulator, current) => accumulator + current);
  }

  return (
    <CurveDemo <string>
      title="String Curve Demo"
      description="A curve constructed using StringKeyframes that can be used to animate string values."
      curve={curveRef}
      valueInput={StringKeyframeValueInput}
      displayGenerator={
          (curve: Curve<string>, keys: { x: number, y: string }[]) => ({
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
            },
            data: [
              {
                type: 'spline',
                toolTipContent: 'Time {x}: {text}',
                dataPoints: keys.map((key) => ({
                  x: key.x,
                  y: stringToVal(key.y),
                  text: key.y,
                  markerType: 'none',
                })),
              },
              {
                type: 'scatter',
                color: 'lightblue',
                toolTipContent: 'Time {x}: {text}',
                dataPoints: curve.keys.map((key) => ({
                  x: key.time,
                  y: stringToVal(key.value),
                  text: key.value,
                  indexLabel: key.value,
                  indexLabelBackgroundColor: 'lightblue',
                  markerType: 'square',
                  markerSize: 20,
                })),
              },
            ],
          })
      }
    >
      <SecondaryStringDisplay curve={curveRef} />
    </CurveDemo>
  );
}

export default StringCurveDemo;
