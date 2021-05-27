import React, { useEffect, useState } from 'react';
import { Curve } from 'curves';
import CanvasJSReact from '../../../../lib/canvasjs/canvasjs.react';
import './CurveDisplay.scss';

const { CanvasJS } = CanvasJSReact;
const { CanvasJSChart } = CanvasJSReact;

export interface DisplayOptions {
  range?: {min: number, max: number};
}

interface CurveDisplayProps<T> {
  curve?: React.RefObject<Curve<T>>;
  steps?: number;
  secondaryDisplay?: React.ReactElement;
  displayOptions?: DisplayOptions;
  displayGenerator: (curve: Curve<T>, keys: {x: number, y: T}[]) => Object;
  updater?: number;
}

function CurveDisplay<T>(props: React.PropsWithChildren<CurveDisplayProps<T>>): React.ReactElement {
  const [options, setOptions] = useState({});
  const [chart, setChart] = useState();

  const generateDisplay = () => {
    if (!props.curve?.current) return;

    const curve: Curve<T> = props.curve?.current;
    let endTime = (curve.duration + curve.startTime);
    let startTime = 0;
    const steps = props.steps ?? 100;

    if (props.displayOptions?.range) {
      endTime = props.displayOptions.range.max;
      startTime = props.displayOptions.range.min;
    }

    const keys: { x: number, y: T }[] = [];
    for (let x = startTime; x <= endTime + 0.01; x += (endTime - startTime) / steps) {
      const key = { x, y: curve.evaluate(x) };
      keys.push(key);
    }

    const newOptions = props.displayGenerator(curve, keys);
    // @ts-ignore
    newOptions.title = undefined;

    if (props.displayOptions?.range) {
      // @ts-ignore
      Object.assign(newOptions.axisX, props.displayOptions.range);
    }

    setOptions(newOptions);
    // @ts-ignore
    if (chart) chart.render();
  };

  useEffect(generateDisplay, [props.updater, props.displayOptions]);

  return (
    <div className="chart-container">
      <div className="curve-chart">
        <CanvasJSChart options={options} onRef={setChart} />
      </div>
      {props.children}
    </div>
  );
}

export default CurveDisplay;
