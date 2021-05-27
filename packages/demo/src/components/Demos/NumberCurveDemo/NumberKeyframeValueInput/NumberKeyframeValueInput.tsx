import React from 'react';
import { Form } from 'react-bootstrap';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function NumberKeyframeValueInput(props: KeyframeValueInputProps<number>) {
  return (
    <Form.Control
      type="number"
      defaultValue={props.defaultValue}
      onChange={(e) => {
        if (!isNaN(Number(e.target.value))) {
          props.onChange(Number(e.target.value));
        }
      }}
    />
  );
}

export default NumberKeyframeValueInput;
