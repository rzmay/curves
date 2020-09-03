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
import { CurveModifier } from '../../../index';
var Ranges = /** @class */ (function (_super) {
    __extends(Ranges, _super);
    function Ranges(ranges, clamp, allowKeyframeValues, rangeStart, rangeEnd) {
        if (ranges === void 0) { ranges = Ranges.AlphaNumeric; }
        if (clamp === void 0) { clamp = true; }
        if (allowKeyframeValues === void 0) { allowKeyframeValues = true; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this._whitelist = [];
        _this.ranges = Array.isArray(ranges) ? ranges : [ranges];
        _this.clamp = clamp;
        _this.allowKeyframeValues = allowKeyframeValues;
        return _this;
    }
    Ranges.prototype.configure = function (curve) {
        var _this = this;
        this._whitelist = [];
        curve.keys.forEach(function (key) {
            _this._whitelist = _this._whitelist.concat(key.value.split(''));
        });
    };
    Ranges.prototype._modify = function (value, time) {
        var _this = this;
        var result = '';
        value.split('').forEach(function (char) {
            // Check if character in ranges
            if (_this._isInRanges(char)) {
                result += char;
            }
            else if (_this.clamp) {
                // Get nearest character in bounds
                var nearest = _this._createBoundsList().reduce(function (closest, current) {
                    var code = char.charCodeAt(0);
                    return Math.abs(closest - code) < Math.abs(current - code) ? closest : current;
                });
                result += String.fromCharCode(nearest);
            }
        });
        return result;
    };
    Ranges.prototype._isInRanges = function (character) {
        var isInRanges = false;
        var code = character.charCodeAt(0);
        this.ranges.forEach(function (r) {
            isInRanges = isInRanges || (r.min <= code && code <= r.max);
        });
        if (this.allowKeyframeValues)
            isInRanges = isInRanges || this._whitelist.includes(character);
        return isInRanges;
    };
    Ranges.prototype._createBoundsList = function () {
        var bounds = [];
        this.ranges.forEach(function (r) {
            bounds.push(r.max);
            bounds.push(r.min);
        });
        return bounds;
    };
    Ranges.createRange = function (min, max) {
        var range = { min: 0, max: 0 };
        if (typeof min === 'string')
            range.min = min.charCodeAt(0);
        else
            range.min = min;
        if (typeof max === 'string')
            range.max = max.charCodeAt(0);
        else
            range.max = max;
        return range;
    };
    Ranges.CapitalAlpha = Ranges.createRange('A', 'Z');
    Ranges.LowercaseAlpha = Ranges.createRange('a', 'z');
    Ranges.Numeric = Ranges.createRange('0', '9');
    Ranges.AlphaAccent = Ranges.createRange('À', 'ÿ');
    Ranges.NonControl = Ranges.createRange(32, 255);
    Ranges.Alpha = [Ranges.CapitalAlpha, Ranges.LowercaseAlpha];
    Ranges.AlphaNumeric = [Ranges.CapitalAlpha, Ranges.LowercaseAlpha, Ranges.Numeric];
    return Ranges;
}(CurveModifier));
export default Ranges;
