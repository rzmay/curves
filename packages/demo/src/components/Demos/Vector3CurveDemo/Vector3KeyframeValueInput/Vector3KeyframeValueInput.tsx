import React, { useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Vector3 } from 'curves';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function Vector3KeyframeValueInput(props: KeyframeValueInputProps<Vector3>) {
  const [vector, setVector] = useState(props.defaultValue);

  return (
    <>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">x</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="number"
          defaultValue={props.defaultValue.x}
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              const val = {
                x: Number(e.target.value),
                y: vector.y,
                z: vector.z,
              };
              props.onChange(val);
              setVector(val);
            }
          }}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">y</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="number"
          defaultValue={props.defaultValue.y}
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              const val = {
                x: vector.x,
                y: Number(e.target.value),
                z: vector.z,
              };
              props.onChange(val);
              setVector(val);
            }
          }}
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">z</InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="number"
          defaultValue={props.defaultValue.z}
          onChange={(e) => {
            if (!isNaN(Number(e.target.value))) {
              const val = {
                x: vector.x,
                y: vector.y,
                z: Number(e.target.value),
              };
              props.onChange(val);
              setVector(val);
            }
          }}
        />
      </InputGroup>
    </>
  );
}

export default Vector3KeyframeValueInput;
