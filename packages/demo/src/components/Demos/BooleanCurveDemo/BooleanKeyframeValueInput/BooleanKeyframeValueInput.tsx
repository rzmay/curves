import React from 'react';
import { Form } from 'react-bootstrap';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function BooleanKeyframeValueInput(props: KeyframeValueInputProps<boolean>) {
  return (
    <Form.Control
      type="checkbox"
      checked={props.defaultValue}
      onChange={(e) => {
        // @ts-ignore
        props.onChange(e.target.checked);
      }}
    />
  );
}

export default BooleanKeyframeValueInput;
