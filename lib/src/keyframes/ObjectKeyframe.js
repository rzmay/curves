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
import colorString from 'color-string';
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
import BooleanKeyframe from './BooleanKeyframe';
import StringKeyframe from './StringKeyframe';
import { Vector3Keyframe } from '../../index';
var ObjectKeyframe = /** @class */ (function (_super) {
    __extends(ObjectKeyframe, _super);
    function ObjectKeyframe(time, value, inEasing, outEasing) {
        if (inEasing === void 0) { inEasing = Easing.cubic; }
        if (outEasing === void 0) { outEasing = undefined; }
        var _this = _super.call(this, time, value, inEasing, outEasing) || this;
        _this.conversionMethods = {
            number: _this.numberKeyframe,
            string: _this.stringKeyframe,
            boolean: _this.booleanKeyframe,
            object: _this.objectKeyframe,
        };
        return _this;
    }
    ObjectKeyframe.prototype.interpolate = function (keyframe, time) {
        var _this = this;
        var result = {};
        var keysWithDuplicates = Object.keys(this.value).concat(Object.keys(keyframe.value));
        var keys = keysWithDuplicates.filter(function (elem, pos) { return keysWithDuplicates.indexOf(elem) === pos; });
        keys.forEach(function (key) {
            // If null, interpolate from next keyframe
            if (_this.value[key] === undefined) {
                result[key] = keyframe._interpolateKey(_this, key, 1 - time);
            }
            else {
                result[key] = _this._interpolateKey(keyframe, key, time);
            }
        });
        return result;
    };
    ObjectKeyframe.prototype._interpolateKey = function (keyframe, key, time) {
        var _this = this;
        var result;
        // Check if value is color string
        if (typeof this.value[key] === 'string' && colorString.get(this.value[key]) !== null) {
            var color = colorString.get(this.value[key]);
            /*
             * Solve with Vec3 keyframes
             * conversion back to original color model fixes discrepancies
             * really all that's necessary is a Vector3 keyframe, rgb works
             */
            var currentColor = this.colorKeyframe(key);
            var nextColor = keyframe.colorKeyframe(key);
            var colorResult = currentColor.color.interpolate(nextColor.color, time);
            var alphaResult = currentColor.alpha.interpolate(nextColor.alpha, time);
            // Convert back to color string, set value
            result = colorString.to[color.model]([colorResult.x, colorResult.y, colorResult.z], alphaResult);
            return result;
        }
        // Otherwise check primitives
        Object.keys(this.conversionMethods).forEach(function (type) {
            // eslint-disable-next-line valid-typeof
            if (typeof _this.value[key] === type) {
                result = _this.conversionMethods[type].bind(_this)(key).interpolate(keyframe.conversionMethods[type].bind(keyframe)(key), time);
                /* If checking object, check if array
                * CONDITIONS:
                * This key is array OR next key is array
                * All keys in this object are integers (indices)
               */
                var isInt = function (n) { return !isNaN(parseInt(n, 10)) && parseInt(n, 10) === parseFloat(n); };
                if (type === 'object'
                    && (Array.isArray(_this.value[key]) || Array.isArray(keyframe.value[key]))
                    && Object.keys(_this.value[key]).every(isInt)) {
                    // Convert to array
                    result = Object.values(result);
                }
            }
        });
        return result;
    };
    ObjectKeyframe.prototype.booleanKeyframe = function (key) {
        if (this.value[key] === undefined
            || typeof this.value[key] !== 'boolean') {
            return new BooleanKeyframe(this.time, false, this.inEasing, this.outEasing);
        }
        return new BooleanKeyframe(this.time, this.value[key], this.inEasing, this.outEasing);
    };
    ObjectKeyframe.prototype.numberKeyframe = function (key) {
        if (this.value[key] === undefined
            || typeof this.value[key] !== 'number') {
            return new NumberKeyframe(this.time, 0, this.inEasing, this.outEasing);
        }
        return new NumberKeyframe(this.time, this.value[key], this.inEasing, this.outEasing);
    };
    ObjectKeyframe.prototype.stringKeyframe = function (key) {
        if (this.value[key] === undefined
            || typeof this.value[key] !== 'string') {
            return new StringKeyframe(this.time, '', this.inEasing, this.outEasing);
        }
        return new StringKeyframe(this.time, this.value[key], this.inEasing, this.outEasing);
    };
    ObjectKeyframe.prototype.objectKeyframe = function (key) {
        if (this.value[key] === undefined
            || typeof this.value[key] !== 'object') {
            return new ObjectKeyframe(this.time, {}, this.inEasing, this.outEasing);
        }
        return new ObjectKeyframe(this.time, this.value[key], this.inEasing, this.outEasing);
    };
    ObjectKeyframe.prototype.colorKeyframe = function (key) {
        var _a;
        var color = colorString.get((_a = this.value[key]) !== null && _a !== void 0 ? _a : 'invalid key');
        if (this.value[key] === undefined
            || typeof this.value[key] !== 'string'
            || color === null) {
            return {
                color: new Vector3Keyframe(this.time, { x: 255, y: 255, z: 255 }, this.inEasing, this.outEasing),
                alpha: new NumberKeyframe(this.time, 1, this.inEasing, this.outEasing),
            };
        }
        return {
            color: new Vector3Keyframe(this.time, { x: color.value[0], y: color.value[1], z: color.value[2] }, this.inEasing, this.outEasing),
            alpha: new NumberKeyframe(this.time, color.value[3], this.inEasing, this.outEasing),
        };
    };
    return ObjectKeyframe;
}(Keyframe));
export default ObjectKeyframe;
