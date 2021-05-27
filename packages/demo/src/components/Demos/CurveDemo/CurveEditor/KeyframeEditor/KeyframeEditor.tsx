import React from 'react';
import { Table, Form, Button } from 'react-bootstrap';
import './KeyframeEditor.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Curve } from 'curves';
import { KeyframeValueInputProps } from './KeyframeValueInput/KeyframeValueInput';
import EasingSelect from './EasingSelect/EasingSelect';

interface KeyframeEditorProps<T> {
    curve: React.RefObject<Curve<T>>;
    valueInput: (props: KeyframeValueInputProps<T>) => React.ReactElement; // eslint-disable-line react/no-unused-prop-types
    onUpdate: () => void;
}

function KeyframeEditor<T>(props: KeyframeEditorProps<T>): React.ReactElement {
  if (!props.curve.current) return <div>No curve found!</div>;

  const KeyframeConstructor = Object.getPrototypeOf(props.curve.current.keys[0]).constructor;

  return (
    <Table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Value</th>
          <th>Easing</th>
        </tr>
      </thead>
      <tbody>
        {props.curve.current.keys.map((key) => (
          <tr key={key.time}>
            <td>
              <Form.Control
                type="number"
                step={1}
                defaultValue={key.time}
                onChange={(e) => {
                  if (!props.curve.current) return;
                  if (!isNaN(Number(e.target.value))) {
                    let value = Number(e.target.value);
                    if (props.curve.current.keys.findIndex((k) => k.time === value) !== -1) {
                      value += 0.1;
                      e.target.value = value.toString();
                    }
                    key.time = Number(e.target.value);
                    props.curve.current.update();
                    props.onUpdate();
                  }
                }}
              />
            </td>
            <td>
              <props.valueInput
                defaultValue={key.value}
                onChange={(value: T) => {
                  key.value = value;
                  props.onUpdate();
                  if (props.curve.current) props.curve.current.update();
                }}
              />
            </td>
            <td>
              <EasingSelect<T> direction="out" keyframe={key} onUpdate={props.onUpdate} />
              <EasingSelect<T> direction="in" keyframe={key} onUpdate={props.onUpdate} />
            </td>
            <td>
              <Button
                variant="link"
                className="keyframe-delete-icon fa-icon-button"
                onClick={() => {
                  if (!props.curve.current) return;
                  props.curve.current.removeKeyframe(key);
                  props.onUpdate();
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </td>
          </tr>
        ))}
        <tr>
          <td colSpan={4} align="center">
            <Button
              variant="link"
              className="keyframe-add-icon fa-icon-button"
              onClick={() => {
                if (!props.curve.current) return;
                const lastKeyframe = props.curve.current.keys[props.curve.current.keys.length - 1];
                const newKeyframe = new KeyframeConstructor(
                  lastKeyframe.time + 1,
                  lastKeyframe.value,
                  lastKeyframe.inEasing,
                  lastKeyframe.outEasing,
                ) as typeof lastKeyframe;

                props.curve.current.addKeyframe(newKeyframe);
                props.onUpdate();
              }}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </td>
        </tr>
      </tbody>
    </Table>
  );
}

export default KeyframeEditor;
