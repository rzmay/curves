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
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
var BooleanKeyframe = /** @class */ (function (_super) {
    __extends(BooleanKeyframe, _super);
    function BooleanKeyframe(time, value, inEasing, outEasing, solveInterpolation, truthThreshold) {
        if (inEasing === void 0) { inEasing = Easing.cubic; }
        if (outEasing === void 0) { outEasing = undefined; }
        if (solveInterpolation === void 0) { solveInterpolation = false; }
        if (truthThreshold === void 0) { truthThreshold = 0.5; }
        var _this = _super.call(this, time, value, inEasing, outEasing) || this;
        _this.solveInterpolation = solveInterpolation;
        _this.truthThreshold = truthThreshold;
        return _this;
    }
    BooleanKeyframe.prototype.interpolate = function (keyframe, time) {
        if (this.solveInterpolation) {
            var value = this.numberKeyframe().interpolate(keyframe.numberKeyframe(), time);
            return value > this.truthThreshold;
        }
        return this.value;
    };
    BooleanKeyframe.prototype.numberKeyframe = function () {
        return new NumberKeyframe(this.time, (this.value ? 1 : 0), this.inEasing, this.outEasing);
    };
    return BooleanKeyframe;
}(Keyframe));
export default BooleanKeyframe;
