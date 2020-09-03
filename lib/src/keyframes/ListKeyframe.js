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
var ListKeyframe = /** @class */ (function (_super) {
    __extends(ListKeyframe, _super);
    function ListKeyframe(time, value, inEasing, outEasing, truncate) {
        if (inEasing === void 0) { inEasing = Easing.cubic; }
        if (outEasing === void 0) { outEasing = undefined; }
        if (truncate === void 0) { truncate = false; }
        var _this = _super.call(this, time, value, inEasing, outEasing) || this;
        _this.truncate = truncate;
        return _this;
    }
    ListKeyframe.prototype.interpolate = function (keyframe, time) {
        var numberKeyframes = this.toNumberKeyframes();
        var nextNumberKeyframes = keyframe.toNumberKeyframes();
        var defaultKeyframe = new NumberKeyframe(keyframe.time, 0, this.inEasing);
        var defaultNextKeyframe = new NumberKeyframe(this.time, 0, keyframe.inEasing);
        var shorter = numberKeyframes.length <= nextNumberKeyframes.length;
        if (this.truncate ? shorter : !shorter) {
            return numberKeyframes.map(function (v, i) { var _a; return v.interpolate((_a = nextNumberKeyframes[i]) !== null && _a !== void 0 ? _a : defaultKeyframe, time); });
        }
        return nextNumberKeyframes.map(function (v, i) { var _a; return v.interpolate((_a = numberKeyframes[i]) !== null && _a !== void 0 ? _a : defaultNextKeyframe, 1 - time); });
    };
    ListKeyframe.prototype.toNumberKeyframes = function () {
        var _this = this;
        return this.value.map(function (v) { return new NumberKeyframe(_this.time, v, _this.inEasing, _this.outEasing); });
    };
    return ListKeyframe;
}(Keyframe));
export default ListKeyframe;
