import React, { useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import './CurveEditor.scss';
import { Curve } from 'curves';
import CurveSettingsEditor from './CurveSettingsEditor/CurveSettingsEditor';
import { DisplayOptions } from '../CurveDisplay/CurveDisplay';
import KeyframeEditor from './KeyframeEditor/KeyframeEditor';
import { KeyframeValueInputProps } from './KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

interface CurveEditorProps<T> {
    curve: React.RefObject<Curve<T>>;
    displayOptions: DisplayOptions;
    onUpdate: (opts?: DisplayOptions)=>void;
    valueInput: (props: KeyframeValueInputProps<T>) => React.ReactElement; // eslint-disable-line react/no-unused-prop-types
}

function CurveEditor<T>(props: CurveEditorProps<T>): React.ReactElement {
  return (
    <div className="tab-container">
      <Tabs defaultActiveKey="keyframe" id="curve-editor">
        <Tab eventKey="keyframe" title="Keyframes" className="tab-content">
          <KeyframeEditor
            curve={props.curve}
            valueInput={props.valueInput}
            onUpdate={props.onUpdate}
          />
        </Tab>
        <Tab eventKey="modifiers" title="Modifiers" className="tab-content">
          <p>Not Yet Implemented</p>
        </Tab>
        <Tab eventKey="curve" title="Curve & Display" className="tab-content">
          <CurveSettingsEditor<T>
            curve={props.curve}
            displayOptions={props.displayOptions}
            onUpdate={props.onUpdate}
          />
        </Tab>
        <Tab eventKey="code" title="Code" className="tab-content">
          <p>Not Yet Implemented</p>
        </Tab>
      </Tabs>
    </div>
  );
}

export default CurveEditor;
