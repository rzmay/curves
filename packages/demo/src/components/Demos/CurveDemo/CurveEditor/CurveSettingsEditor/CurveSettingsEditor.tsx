import React from 'react';
import './CurveSettingsEditor.scss';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { Curve, EndBehavior } from 'curves';
import { DisplayOptions } from '../../CurveDisplay/CurveDisplay';

interface CurveSettingsEditorProps<T> {
    curve: React.RefObject<Curve<T>>;
    displayOptions: DisplayOptions;
    onUpdate: (opts?: DisplayOptions)=>void;
}

function CurveSettingsEditor<T>(props: CurveSettingsEditorProps<T>): React.ReactElement {
  const endBehaviorNums = Object.keys(EndBehavior).filter((e) => !isNaN(Number(e)));
  const endBehaviorEntries = endBehaviorNums.map((n) => EndBehavior[n]);

  function updateRangeMax(max: number) {
    if (!props.curve.current) return;
    const opts = props.displayOptions;
    opts.range = { min: props.displayOptions.range?.min ?? props.curve.current.startTime, max };
    props.onUpdate(opts);
  }

  function updateRangeMin(min: number) {
    if (!props.curve.current) return;
    const opts = props.displayOptions;
    opts.range = { max: props.displayOptions.range?.max ?? props.curve.current.endTime, min };
    props.onUpdate(opts);
  }

  return (
    <div>
      <h5>Curve Settings</h5>
      <Container className="curve-settings-container">
        <Row>
          <Col><strong>End Behavior</strong></Col>
          <Col>
            <Form.Control
              as="select"
              onChange={(e) => {
                const { value } = e.target as HTMLInputElement;
                if (!props.curve.current) return;
                props.curve.current.endBehaviour = EndBehavior[value];
                props.onUpdate();
              }}
            >
              {endBehaviorEntries.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </Form.Control>
          </Col>
        </Row>
        <Row>
          <Col><strong>Smoothing</strong></Col>
          <Col>
            <Form.Control
              type="number"
              defaultValue={props.curve.current ? props.curve.current.smoothing : 0.25}
              step={0.05}
              onChange={(e) => {
                const { value } = e.target as HTMLInputElement;
                if (!isNaN(Number(value))) {
                  if (!props.curve.current) return;
                  props.curve.current.smoothing = Number(value);
                  props.onUpdate();
                }
              }}
            />
          </Col>
        </Row>
      </Container>
      <hr />
      <h5>Display Settings</h5>
      <Container className="display-settings-container">
        <Row>
          <Col sm={6}><strong>Range</strong></Col>
          <Col sm={3}>
            <Form.Label>Min</Form.Label>
            <Form.Control
              type="number"
              defaultValue={props.curve.current ? props.curve.current.endTime : 0}
              onChange={(e) => {
                const { value } = e.target as HTMLInputElement;
                if (!isNaN(Number(value))) {
                  updateRangeMin(Number(value));
                }
              }}
            />
          </Col>
          <Col sm={3}>
            <Form.Label>Max</Form.Label>
            <Form.Control
              type="number"
              defaultValue={props.curve.current ? props.curve.current.endTime : 10}
              onChange={(e) => {
                const { value } = e.target as HTMLInputElement;
                if (!isNaN(Number(value))) {
                  updateRangeMax(Number(value));
                }
              }}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default CurveSettingsEditor;
