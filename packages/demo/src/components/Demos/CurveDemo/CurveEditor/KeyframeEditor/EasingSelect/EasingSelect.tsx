import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Easing } from 'eaz';
import { Keyframe } from 'curves';

interface EasingSelectProps<T> {
    direction: 'in' | 'out';
    keyframe: Keyframe<T>;
    onUpdate: () => void;
}

function EasingSelect<T>(props: EasingSelectProps<T>): React.ReactElement {
  const easingOptions = {
    linear: Easing.linear,
    quadratic: Easing.quadratic,
    cubic: Easing.cubic,
    quartic: Easing.quartic,
    quintic: Easing.quintic,
    exponential: Easing.exponential(),
    sinusoidal: Easing.sinusoidal,
    halfSine: Easing.halfSine,
    circular: Easing.circular,
    elastic: Easing.elastic,
    back: Easing.back(),
    stepped: Easing.stepped(),
    wiggle: Easing.wiggle(),
    noise: Easing.noise(),
  };

  return (
    <InputGroup>
      <InputGroup.Prepend>
        <InputGroup.Text>{props.direction}</InputGroup.Text>
      </InputGroup.Prepend>
      <Form.Control
        as="select"
        defaultValue="cubic"
        onChange={(e) => {
          const { value } = e.target as HTMLInputElement;
          props.keyframe[`${props.direction}Easing`] = easingOptions[value];
          props.onUpdate();
        }}
      >
        {Object.keys(easingOptions).map((e) => (
          <option key={e}>{e}</option>
        ))}
      </Form.Control>
    </InputGroup>
  );
}

export default EasingSelect;
