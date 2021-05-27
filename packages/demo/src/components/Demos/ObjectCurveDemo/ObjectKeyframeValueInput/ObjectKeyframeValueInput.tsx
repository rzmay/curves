import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function ObjectKeyframeValueInput(props: KeyframeValueInputProps<object>) {
  const [json, setJson] = useState(props.defaultValue);

  function handleEdit(edit) {
    props.onChange(edit.updated_src);
    setJson(edit.updated_src);
  }

  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      overlay={(
        <Popover id={`color-picker-popover-${Math.random()}`}>
          <Popover.Content>
            <ReactJson
              src={json}
              onEdit={handleEdit}
              onAdd={handleEdit}
              onDelete={handleEdit}
              displayObjectSize={false}
            />
          </Popover.Content>
        </Popover>
      )}
      rootClose
    >
      <Button variant="outline-secondary">Edit...</Button>
    </OverlayTrigger>
  );
}

export default ObjectKeyframeValueInput;
