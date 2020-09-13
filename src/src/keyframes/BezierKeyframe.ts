// eslint-disable-next-line max-classes-per-file
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import { Curve } from '../../index';
import solveCubic from '../helpers/SolveCubic';

class BezierHandle {
    angle: number;
    magnitude: number;

    constructor(angle: number, magnitude = 1) {
      this.angle = angle;
      this.magnitude = magnitude;
    }

    toCartesian(origin: {x: number, y: number}): {x: number, y: number} {
      return {
        x: origin.x + Math.cos(this.angle) * this.magnitude,
        y: origin.y + Math.sin(this.angle) * this.magnitude,
      };
    }

    fromCartesian(origin: {x: number, y: number}, coordinates: {x: number, y: number}) {
      this.angle = Math.atan2(coordinates.y - origin.y, coordinates.x - origin.x);
      this.magnitude = Math.sqrt(
        (coordinates.x - origin.x) ** 2
          + (coordinates.y - origin.y) ** 2,
      );
    }
}

class BezierKeyframe extends Keyframe<number> {
    inHandle: BezierHandle;
    outHandle: BezierHandle;

    automaticHandles: boolean;
    defaultMagnitude: number;

    constructor(
      time: number,
      value: number,
      inHandle: BezierHandle | undefined = undefined,
      outHandle: BezierHandle | undefined = new BezierHandle(Math.PI),
      defaultMagnitude = 1,
    ) {
      super(time, value, Easing.cubic);

      this.automaticHandles = (inHandle === undefined);

      this.inHandle = inHandle ?? new BezierHandle(0);
      this.outHandle = outHandle
          ?? new BezierHandle(
            (this.inHandle.angle + Math.PI) % (Math.PI * 2),
            this.inHandle.magnitude,
          );

      this.defaultMagnitude = defaultMagnitude;
    }

    configure(curve: Curve<number>) {
      if (!this.automaticHandles) {
        this._restrictHandles(curve);
        return;
      }

      const index = curve.keys.indexOf(this);

      let previousKey: BezierKeyframe | Keyframe<number> | undefined;
      let nextKey: BezierKeyframe | Keyframe<number> | undefined;

      if (index > 0) {
        previousKey = curve.keys[index - 1];
      }
      if (index < curve.keys.length - 1) {
        nextKey = curve.keys[index + 1];
      }

      // If previousKey and nextKey are both undefined, restrict and return
      if (previousKey === undefined && nextKey === undefined) {
        this._restrictHandles(curve);
        return;
      }

      const slopes: number[] = [];

      if (previousKey) {
        slopes.push((this.value - previousKey.value) / (this.time - previousKey.time));
      }
      if (nextKey) {
        slopes.push((nextKey.value - this.value) / (nextKey.time - this.time));
      }

      const slope = slopes.reduce((a, b) => a + b, 0) / slopes.length;
      const angle = Math.atan(slope);

      /*
          * Magnitude should be smallest value out of
          *    defaultMagnitude,
          *    half distance between previous and this,
          *    half distance between this and next
        */
      let magnitude = this.defaultMagnitude;

      if (previousKey) {
        // const distance = (((this.time - previousKey.time) ** 2) + ((this.value - previousKey.value) ** 2)) ** 0.25;
        const distance = (this.time - previousKey.time) * 0.5;
        magnitude = Math.min(magnitude, distance);
      }
      if (nextKey) {
        // const distance = (((nextKey.time - this.time) ** 2) + ((nextKey.value - this.value) ** 2)) ** 0.25;
        const distance = (nextKey.time - this.time) * 0.5;
        magnitude = Math.min(magnitude, distance);
      }

      this.inHandle = new BezierHandle(angle, magnitude);
      this.outHandle = new BezierHandle((angle + Math.PI) % (Math.PI * 2), magnitude);

      this._restrictHandles(curve);
    }

    interpolate(keyframe: BezierKeyframe | Keyframe<number>, time: number, smoothing = 0.25): number {
      const currentCartesian = { x: this.time, y: this.value };
      const nextCartesian = { x: keyframe.time, y: keyframe.value };

      const outHandle = keyframe instanceof BezierKeyframe
        ? keyframe.outHandle
        : new BezierHandle(Math.PI, this.defaultMagnitude);

      const points: {x: number, y: number}[] = [
        currentCartesian,
        this.inHandle.toCartesian(currentCartesian),
        outHandle.toCartesian(nextCartesian),
        nextCartesian,
      ];

      // Scale time to curve time
      const x = this.time + ((keyframe.time - this.time) * time);

      // Calculate coefficients for cubic equation
      const A = (-points[0].x + (3 * points[1].x) - (3 * points[2].x) + points[3].x);
      const B = ((3 * points[0].x) - (6 * points[1].x) + (3 * points[2].x));
      const C = ((-3 * points[0].x) + (3 * points[1].x));
      const D = (points[0].x - x);

      // Solve cubic equation for time (interpolation through bezier curve)
      // Epsilon for tolerance, but always clamp afterwards for accuracy
      const epsilon = 1e-8;
      const t = Math.min(
        1,
        Math.max(
          0,
          solveCubic(A, B, C, D).find((n) => (n >= 0 - epsilon && n <= 1 + epsilon)) ?? 0,
        ),
      );

      return BezierKeyframe._evaluateY(
        points[0].y,
        points[1].y,
        points[2].y,
        points[3].y,
        t,
      );
    }

    private _restrictHandles(curve: Curve<number>) {
      const index = curve.keys.indexOf(this);

      let previousKey: BezierKeyframe | Keyframe<number> = this;
      let nextKey: BezierKeyframe | Keyframe<number> = this;

      const origin = {
        x: this.time,
        y: this.value,
      };

      // Restrict outHandle
      if (index > 0) {
        previousKey = curve.keys[index - 1];
        const cartesian = this.outHandle.toCartesian(origin);

        this.outHandle.fromCartesian(
          origin,
          {
            x: Math.min(Math.max(cartesian.x, previousKey.time), this.time),
            y: cartesian.y,
          },
        );
      }

      // Restrict inHandle
      if (index < curve.keys.length - 1) {
        nextKey = curve.keys[index + 1];
        const cartesian = this.inHandle.toCartesian(origin);

        this.inHandle.fromCartesian(
          origin,
          {
            x: Math.min(Math.max(cartesian.x, this.time), nextKey.time),
            y: cartesian.y,
          },
        );
      }

      // If automatic, preserve handle magnitude equality
      if (this.automaticHandles) {
        if (this.inHandle.magnitude < this.outHandle.magnitude) {
          this.outHandle.magnitude = this.inHandle.magnitude;
        } else {
          this.inHandle.magnitude = this.outHandle.magnitude;
        }
      }
    }

    static automatic(time: number, value: number, magnitude = 1): BezierKeyframe {
      return new BezierKeyframe(time, value, undefined, undefined, magnitude);
    }

    private static _evaluateY(y1: number, y2: number, y3: number, y4: number, time: number): number {
      return ((1 - time) ** 3) * y1
            + ((1 - time) ** 2) * 3 * y2 * time
            + (1 - time) * 3 * y3 * (time ** 2)
            + (time ** 3) * y4;
    }
}

export default BezierKeyframe;
export { BezierHandle };
