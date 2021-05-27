import React from 'react';
import { Form } from 'react-bootstrap';
import { KeyframeValueInputProps } from '../../CurveDemo/CurveEditor/KeyframeEditor/KeyframeValueInput/KeyframeValueInput';

function ListKeyframeValueInput(props: KeyframeValueInputProps<number[]>) {
  return (
    <Form.Control
      type="string"
      defaultValue={props.defaultValue
        .map((num) => num.toString())
        .reduce((accumulator, next) => `${accumulator},${next}`)}
      onChange={(e) => {
        const list = e.target.value.split(',').map((n) => Number(n));
        if (!list.map((num) => isNaN(num)).includes(true)) {
          props.onChange(list);
        }
      }}
    />
  );
}

export default ListKeyframeValueInput;
