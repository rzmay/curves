import React from 'react';
import { Row, Col } from 'react-bootstrap';
import NumberCurveDemo from './NumberCurveDemo/NumberCurveDemo';
import StringCurveDemo from './StringCurveDemo/StringCurveDemo';
import BooleanCurveDemo from './BooleanCurveDemo/BooleanCurveDemo';
import ListCurveDemo from './ListCurveDemo/ListCurveDemo';
import RGBCurveDemo from './RGBCurveDemo/RGBCurveDemo';
import HSVCurveDemo from './HSVCurveDemo/HSVCurveDemo';
import Vector3CurveDemo from './Vector3CurveDemo/Vector3CurveDemo';
import ObjectCurveDemo from './ObjectCurveDemo/ObjectCurveDemo';
import BezierCurveDemo from './BezierCurveDemo/BezierCurveDemo';

function Demos(): React.ReactElement {
  return (
    <>
      <Row>
        <Col className="text-center">
          <h1>Curve Type Demos</h1>
          <p>There are 9 implemented typed keyframes. Below are examples of curves using each of these implemented keyframes.</p>
        </Col>
      </Row>
      <Row>
        <Col xl={6} className="px-4">
          <NumberCurveDemo />
        </Col>
        <Col xl={6} className="px-4">
          <StringCurveDemo />
        </Col>
      </Row>
      <Row>
        <Col xl={6} className="px-4">
          <BooleanCurveDemo />
        </Col>
        <Col xl={6} className="px-4">
          <ListCurveDemo />
        </Col>
      </Row>
      <Row>
        <Col xl={6} className="px-4">
          <RGBCurveDemo />
        </Col>
        <Col xl={6} className="px-4">
          <HSVCurveDemo />
        </Col>
      </Row>
      <Row>
        <Col xl={6} className="px-4">
          <Vector3CurveDemo />
        </Col>
        <Col xl={6} className="px-4">
          <ObjectCurveDemo />
        </Col>
      </Row>
      <Row>
        <Col xl={6} className="px-4">
          <BezierCurveDemo />
        </Col>
      </Row>
    </>
  );
}

export default Demos;
