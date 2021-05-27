import React, { useRef, useState } from 'react';
import './ObjectCurveDemo.scss';
import ReactJson from 'react-json-view';
import { Curve, Modifiers } from 'curves';
import CurveDemo from '../CurveDemo/CurveDemo';
import ObjectThreeJSDemo from './ObjectThreeJSDemo/ObjectThreeJSDemo';
import ObjectKeyframeValueInput from './ObjectKeyframeValueInput/ObjectKeyframeValueInput';

function ObjectCurveDemo(): React.ReactElement {
  const [time, setTime] = useState(0);
  const backgroundColor = '#f0f0f0';
  const demoCurve: Curve<object> = Curve.objectBuilder(
    {
      color: 'skyblue',

      wheelSpeed: 0,
      suspension: 0.5,

      lights: {
        front: false,
        rear: true,
        interior: true,
      },
    },
    {
      color: 'coral',

      wheelSpeed: 5,
      suspension: -0.5,
      windowDown: {
        left: 1,
        right: 1,
      },

      lights: {
        front: true,
        rear: false,
        interior: true,
      },
    },
    10,
  );

  const curveRef = useRef(demoCurve);

  return (
    <CurveDemo<object>
      title="Object Curve Demo"
      description="A curve constructed using ObjectKeyframes. ObjectKeyframes can be used to interpolate between any JSON values. For this demo, a scene has been set up that can be controlled by the value of the JSON returned by evaluating the curve."
      valueInput={ObjectKeyframeValueInput}
      curve={curveRef}
      display={(
        <div className="object-logger-container" style={{ backgroundColor }}>
          <div className="json-logger">
            <ReactJson
              src={curveRef.current.evaluate(time)}
              displayDataTypes={false}
              displayObjectSize={false}
            />
          </div>
        </div>
      )}
    >
      <ObjectThreeJSDemo curve={curveRef} onTimeChange={setTime} />
    </CurveDemo>
  );
}

export default ObjectCurveDemo;
