var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// eslint-disable-next-line max-classes-per-file
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import solveCubic from '../helpers/SolveCubic';
var BezierHandle = /** @class */ (function () {
    function BezierHandle(angle, magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        this.angle = angle;
        this.magnitude = magnitude;
    }
    BezierHandle.prototype.toCartesian = function (origin) {
        return {
            x: origin.x + Math.cos(this.angle) * this.magnitude,
            y: origin.y + Math.sin(this.angle) * this.magnitude,
        };
    };
    BezierHandle.prototype.fromCartesian = function (origin, coordinates) {
        this.angle = Math.atan2(coordinates.y - origin.y, coordinates.x - origin.x);
        this.magnitude = Math.sqrt(Math.pow((coordinates.x - origin.x), 2)
            + Math.pow((coordinates.y - origin.y), 2));
    };
    return BezierHandle;
}());
var BezierKeyframe = /** @class */ (function (_super) {
    __extends(BezierKeyframe, _super);
    function BezierKeyframe(time, value, inHandle, outHandle, defaultMagnitude) {
        if (inHandle === void 0) { inHandle = undefined; }
        if (outHandle === void 0) { outHandle = new BezierHandle(Math.PI); }
        if (defaultMagnitude === void 0) { defaultMagnitude = 1; }
        var _this = _super.call(this, time, value, Easing.cubic) || this;
        _this.automaticHandles = (inHandle === undefined);
        _this.inHandle = inHandle !== null && inHandle !== void 0 ? inHandle : new BezierHandle(0);
        _this.outHandle = outHandle !== null && outHandle !== void 0 ? outHandle : new BezierHandle((_this.inHandle.angle + Math.PI) % (Math.PI * 2), _this.inHandle.magnitude);
        _this.defaultMagnitude = defaultMagnitude;
        return _this;
    }
    BezierKeyframe.prototype.configure = function (curve) {
        if (!this.automaticHandles) {
            this._restrictHandles(curve);
            return;
        }
        var index = curve.keys.indexOf(this);
        var previousKey;
        var nextKey;
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
        var slopes = [];
        if (previousKey) {
            slopes.push((this.value - previousKey.value) / (this.time - previousKey.time));
        }
        if (nextKey) {
            slopes.push((nextKey.value - this.value) / (nextKey.time - this.time));
        }
        var slope = slopes.reduce(function (a, b) { return a + b; }, 0) / slopes.length;
        var angle = Math.atan(slope);
        /*
            * Magnitude should be smallest value out of
            *    defaultMagnitude,
            *    half distance between previous and this,
            *    half distance between this and next
          */
        var magnitude = this.defaultMagnitude;
        if (previousKey) {
            // const distance = (((this.time - previousKey.time) ** 2) + ((this.value - previousKey.value) ** 2)) ** 0.25;
            var distance = (this.time - previousKey.time) * 0.5;
            magnitude = Math.min(magnitude, distance);
        }
        if (nextKey) {
            // const distance = (((nextKey.time - this.time) ** 2) + ((nextKey.value - this.value) ** 2)) ** 0.25;
            var distance = (nextKey.time - this.time) * 0.5;
            magnitude = Math.min(magnitude, distance);
        }
        this.inHandle = new BezierHandle(angle, magnitude);
        this.outHandle = new BezierHandle((angle + Math.PI) % (Math.PI * 2), magnitude);
        this._restrictHandles(curve);
    };
    BezierKeyframe.prototype.interpolate = function (keyframe, time, smoothing) {
        var _a;
        if (smoothing === void 0) { smoothing = 0.25; }
        var currentCartesian = { x: this.time, y: this.value };
        var nextCartesian = { x: keyframe.time, y: keyframe.value };
        var outHandle = keyframe instanceof BezierKeyframe
            ? keyframe.outHandle
            : new BezierHandle(Math.PI, this.defaultMagnitude);
        var points = [
            currentCartesian,
            this.inHandle.toCartesian(currentCartesian),
            outHandle.toCartesian(nextCartesian),
            nextCartesian,
        ];
        // Scale time to curve time
        var x = this.time + ((keyframe.time - this.time) * time);
        // Calculate coefficients for cubic equation
        var A = (-points[0].x + (3 * points[1].x) - (3 * points[2].x) + points[3].x);
        var B = ((3 * points[0].x) - (6 * points[1].x) + (3 * points[2].x));
        var C = ((-3 * points[0].x) + (3 * points[1].x));
        var D = (points[0].x - x);
        // Solve cubic equation for time (interpolation through bezier curve)
        // Epsilon for tolerance, but always clamp afterwards for accuracy
        var epsilon = 1e-8;
        var t = Math.min(1, Math.max(0, (_a = solveCubic(A, B, C, D).find(function (n) { return (n >= 0 - epsilon && n <= 1 + epsilon); })) !== null && _a !== void 0 ? _a : 0));
        return BezierKeyframe._evaluateY(points[0].y, points[1].y, points[2].y, points[3].y, t);
    };
    BezierKeyframe.prototype._restrictHandles = function (curve) {
        var index = curve.keys.indexOf(this);
        var previousKey = this;
        var nextKey = this;
        var origin = {
            x: this.time,
            y: this.value,
        };
        // Restrict outHandle
        if (index > 0) {
            previousKey = curve.keys[index - 1];
            var cartesian = this.outHandle.toCartesian(origin);
            this.outHandle.fromCartesian(origin, {
                x: Math.min(Math.max(cartesian.x, previousKey.time), this.time),
                y: cartesian.y,
            });
        }
        // Restrict inHandle
        if (index < curve.keys.length - 1) {
            nextKey = curve.keys[index + 1];
            var cartesian = this.inHandle.toCartesian(origin);
            this.inHandle.fromCartesian(origin, {
                x: Math.min(Math.max(cartesian.x, this.time), nextKey.time),
                y: cartesian.y,
            });
        }
        // If automatic, preserve handle magnitude equality
        if (this.automaticHandles) {
            if (this.inHandle.magnitude < this.outHandle.magnitude) {
                this.outHandle.magnitude = this.inHandle.magnitude;
            }
            else {
                this.inHandle.magnitude = this.outHandle.magnitude;
            }
        }
    };
    BezierKeyframe.automatic = function (time, value, magnitude) {
        if (magnitude === void 0) { magnitude = 1; }
        return new BezierKeyframe(time, value, undefined, undefined, magnitude);
    };
    BezierKeyframe._evaluateY = function (y1, y2, y3, y4, time) {
        return (Math.pow((1 - time), 3)) * y1
            + (Math.pow((1 - time), 2)) * 3 * y2 * time
            + (1 - time) * 3 * y3 * (Math.pow(time, 2))
            + (Math.pow(time, 3)) * y4;
    };
    return BezierKeyframe;
}(Keyframe));
export default BezierKeyframe;
export { BezierHandle };
