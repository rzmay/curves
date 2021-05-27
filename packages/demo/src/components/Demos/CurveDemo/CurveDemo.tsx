import React, { useEffect, useRef, useState } from 'react';
import './CurveDemo.scss';
import { Curve } from 'curves';
import { Collapse, Button } from 'react-bootstrap';
import CurveDisplay, { DisplayOptions } from './CurveDisplay/CurveDisplay';
import CurveEditor from './CurveEditor/CurveEditor';
import { KeyframeValueInputProps } from './CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

interface CurveDemoProps<T> {
    title?: string;
    description?: string;
    curve: React.RefObject<Curve<T>>;
    steps?: number;
    display?: React.ReactElement;
    displayGenerator?: (curve: Curve<T>, keys: {x: number, y: T}[]) => Object;
    displayOptions?: DisplayOptions;
    editor?: boolean;
    valueInput?: (props: KeyframeValueInputProps<T>) => React.ReactElement; // eslint-disable-line react/no-unused-prop-types
}

function CurveDemo<T>(props: React.PropsWithChildren<CurveDemoProps<T>>): React.ReactElement {
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>(props.displayOptions ?? {});
  const [open, setOpen] = useState(false);

  const [value, setValue] = useState(0); // integer state
  const forceUpdate = () => setValue(value + 1); // update the state to force render

  return (
    <div className="demo-container">
      <h2>{props.title ?? 'Curve Demo'}</h2>
      <p className="py-2">{props.description ?? undefined}</p>
      <Collapse in={open} className="w-100">
        <div className="curve-demo-collapse-content">
          {props.display !== undefined ? (
            <div>
              {props.display}
            </div>
          )
            : (
              <CurveDisplay<T>
                steps={props.steps ?? 50}
                curve={props.curve}
                displayGenerator={props.displayGenerator ?? ((curve: Curve<T>, keys: {x: number, y: T}[]) => ({}))}
                displayOptions={displayOptions}
                updater={value}
              />
            )}
          {props.children}
          <br />
          {
        (props.editor ?? true)
          ? (
            <div>
              <h3>Edit your curve</h3>
              <CurveEditor
                curve={props.curve}
                displayOptions={displayOptions}
                onUpdate={(opts?: DisplayOptions) => {
                  if (opts) setDisplayOptions(opts);
                  forceUpdate();
                }}
                valueInput={props.valueInput ?? ((p: KeyframeValueInputProps<T>) => (<div />))}
              />
            </div>
          ) : undefined
        }
        </div>
      </Collapse>
      <Button
        className="mt-2"
        variant="outline-primary"
        onClick={() => {
          setOpen(!open);
          forceUpdate();
        }}
        block
      >{open ? 'Hide' : 'Show'}
      </Button>
    </div>
  );
}

export default CurveDemo;
