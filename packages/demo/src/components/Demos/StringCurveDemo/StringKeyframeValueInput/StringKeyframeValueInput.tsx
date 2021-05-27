import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function StringKeyframeValueInput(props: KeyframeValueInputProps<string>) {
  const [value, setValue] = useState(props.defaultValue);

  return (
    <Form.Control
      type="string"
      defaultValue={props.defaultValue}
      onChange={(e) => {
        const input = e.target.value.toString();
        props.onChange(input);
        setValue(input);
      }}
    />
  );
}

export default StringKeyframeValueInput;
