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
import ListKeyframe from './ListKeyframe';
var StringKeyframe = /** @class */ (function (_super) {
    __extends(StringKeyframe, _super);
    function StringKeyframe(time, value, inEasing, outEasing) {
        if (inEasing === void 0) { inEasing = Easing.cubic; }
        if (outEasing === void 0) { outEasing = undefined; }
        var _this = _super.call(this, time, value, inEasing, outEasing) || this;
        _this.listKeyframe = _this.toListKeyframe();
        return _this;
    }
    StringKeyframe.prototype.interpolate = function (keyframe, time) {
        return this.listKeyframe
            .interpolate(keyframe.listKeyframe, time)
            .map(function (n) { return String.fromCharCode(Math.round(n)); })
            .join('');
    };
    StringKeyframe.prototype.toListKeyframe = function () {
        var floatList = this.value.split('').map(function (c) { return c.charCodeAt(0); });
        return new ListKeyframe(this.time, floatList, this.inEasing, this.outEasing);
    };
    return StringKeyframe;
}(Keyframe));
export default StringKeyframe;
