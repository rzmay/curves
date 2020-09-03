import { Easing } from 'eaz';
import EndBehavior from './EndBehavior';
import NumberKeyframe from './keyframes/NumberKeyframe';
import BezierKeyframe from './keyframes/BezierKeyframe';
import RGBColorKeyframe from './keyframes/RGBColorKeyframe';
import Vector3Keyframe from './keyframes/Vector3Keyframe';
import HSVColorKeyframe from './keyframes/HSVColorKeyframe';
import ListKeyframe from './keyframes/ListKeyframe';
import ObjectKeyframe from './keyframes/ObjectKeyframe';
import BooleanKeyframe from './keyframes/BooleanKeyframe';
import StringKeyframe from './keyframes/StringKeyframe';
var Curve = /** @class */ (function () {
    function Curve(keys, modifiers, endBehavior, smoothing) {
        if (keys === void 0) { keys = []; }
        if (modifiers === void 0) { modifiers = []; }
        if (endBehavior === void 0) { endBehavior = EndBehavior.Clamp; }
        if (smoothing === void 0) { smoothing = 0.25; }
        this.startTime = 0;
        this.endTime = 0;
        this.duration = 0;
        this.smoothing = 0.25;
        this.keys = keys;
        this.endBehaviour = endBehavior;
        this.modifiers = modifiers;
        this.smoothing = smoothing;
        this.update();
    }
    Curve.prototype.update = function () {
        this._calculateBounds();
        this._configureKeyframes();
        this._configureModifiers();
    };
    Curve.prototype.addModifier = function (modifier) {
        this.modifiers.push(modifier);
        this._configureKeyframes();
        this._configureModifiers();
    };
    // Add a keyframe
    Curve.prototype.addKeyframe = function (keyframe) {
        this.keys.push(keyframe);
        this.update();
    };
    Curve.prototype.removeKeyframe = function (keyframe) {
        var e = 1e-8;
        var index = this.keys.findIndex(function (k) { return Math.abs(k.time - keyframe.time) < e && k.value === keyframe.value; });
        this.removeKeyframeByIndex(index);
    };
    Curve.prototype.removeKeyframeByTime = function (time) {
        var e = 1e-8;
        var index = this.keys.findIndex(function (k) { return Math.abs(k.time - time) < e; });
        this.removeKeyframeByIndex(index);
    };
    Curve.prototype.removeKeyframeByIndex = function (index) {
        this.keys.splice(index, 1);
        this.update();
    };
    Curve.prototype.shiftPhase = function (amount) {
        this.keys.forEach(function (k) { k.time += amount; });
        this.update();
    };
    Curve.prototype.evaluate = function (time, modifierStop) {
        if (modifierStop === void 0) { modifierStop = -1; }
        var rawValue = this._rawEvaluate(time);
        return this._applyModifiers(rawValue, time, modifierStop);
    };
    Curve.prototype._configureKeyframes = function () {
        var _this = this;
        this.keys.forEach(function (k) { return k.configure(_this); });
    };
    Curve.prototype._configureModifiers = function () {
        var _this = this;
        this.modifiers.forEach(function (modifier) { return modifier.configure(_this); });
    };
    Curve.prototype._applyModifiers = function (rawValue, time, modifierStop) {
        var _this = this;
        var value = rawValue;
        // To avoid recursion on evaluation dependent modifiers like cycles
        var modifiers = this.modifiers.slice(0, modifierStop === -1 ? this.modifiers.length : modifierStop);
        // Apply each modifier
        modifiers.forEach(function (m) {
            value = m.evaluate(_this, value, time);
        });
        return value;
    };
    // Evaluate the curve at a specific time
    Curve.prototype._rawEvaluate = function (time) {
        if (this.startTime <= time && time <= this.endTime) {
            return this._rangeEvaluate(time);
        }
        switch (this.endBehaviour) {
            case EndBehavior.Clamp:
                if (this.startTime > time) {
                    return this._rangeEvaluate(this.startTime); // First keyframe
                }
                return this._rangeEvaluate(this.endTime); // Last keyframe
            case EndBehavior.Loop:
                return this._rangeEvaluate(((time < 0) ? this.endTime + time : time)
                    % this.endTime); // Use mod to loop
            case EndBehavior.PingPong:
                return this._rangeEvaluate(this._pingPongTime(time));
            default:
                return this._rangeEvaluate(0); // Unreachable
        }
    };
    // Time is guaranteed to be in curve range
    Curve.prototype._rangeEvaluate = function (time) {
        // Edge cases
        if (time === this.startTime)
            return this.keys[0].value;
        if (time === this.endTime)
            return this.keys[this.keys.length - 1].value;
        var index = 0;
        var found = false;
        for (var i = 0; i < this.keys.length && !found; i += 1) {
            if (time <= this.keys[i].time) {
                found = true;
                index = i;
            }
        }
        return this.keys[index - 1].interpolateRealtime(this.keys[index], time, this.smoothing);
    };
    // Get start & end time of curve
    Curve.prototype._calculateBounds = function () {
        this.keys.sort(function (k1, k2) { return k1.time - k2.time; });
        if (this.keys.length > 0) {
            this.startTime = this.keys[0].time;
            this.endTime = this.keys[this.keys.length - 1].time;
            this.duration = this.endTime - this.startTime;
        }
        else {
            this.startTime = 0;
            this.endTime = 0;
            this.duration = 0;
        }
    };
    // Calculate ping-ponged time
    Curve.prototype._pingPongTime = function (time) {
        return Math.abs(-((time - this.duration) % (2 * this.duration)) + this.duration);
    };
    Curve.builder = function (KeyframeType, inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return new Curve([
            new KeyframeType(0, inValue, easing),
            new KeyframeType(duration, outValue, easing),
        ]);
    };
    Curve.floatBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(NumberKeyframe, inValue, outValue, duration, easing);
    };
    Curve.bezierBuilder = function (inValue, outValue, duration, handleMagnitude, automatic) {
        if (duration === void 0) { duration = 1; }
        if (handleMagnitude === void 0) { handleMagnitude = 1; }
        if (automatic === void 0) { automatic = false; }
        return new Curve([
            new BezierKeyframe(0, inValue),
            new BezierKeyframe(duration, outValue),
        ].map(function (k) {
            k.automaticHandles = automatic;
            k.inHandle.magnitude = handleMagnitude;
            k.outHandle.magnitude = handleMagnitude;
            return k;
        }));
    };
    Curve.booleanBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(BooleanKeyframe, inValue, outValue, duration, easing);
    };
    Curve.stringBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(StringKeyframe, inValue, outValue, duration, easing);
    };
    Curve.rgbColorBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(RGBColorKeyframe, inValue, outValue, duration, easing);
    };
    Curve.hsvColorBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(HSVColorKeyframe, inValue, outValue, duration, easing);
    };
    Curve.vector3Builder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(Vector3Keyframe, inValue, outValue, duration, easing);
    };
    Curve.listBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(ListKeyframe, inValue, outValue, duration, easing);
    };
    Curve.objectBuilder = function (inValue, outValue, duration, easing) {
        if (duration === void 0) { duration = 1; }
        if (easing === void 0) { easing = Easing.cubic; }
        return Curve.builder(ObjectKeyframe, inValue, outValue, duration, easing);
    };
    Curve.increaseFloat = Curve.floatBuilder(0, 1);
    Curve.decreaseFloat = Curve.floatBuilder(1, 0);
    Curve.increaseColor = Curve.rgbColorBuilder({ r: 0, b: 0, g: 0 }, { r: 255, b: 255, g: 255 });
    Curve.decreaseColor = Curve.rgbColorBuilder({ r: 255, b: 255, g: 255 }, { r: 0, b: 0, g: 0 });
    return Curve;
}());
export default Curve;
