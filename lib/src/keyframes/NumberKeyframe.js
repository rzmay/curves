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
var NumberKeyframe = /** @class */ (function (_super) {
    __extends(NumberKeyframe, _super);
    function NumberKeyframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NumberKeyframe.prototype.interpolate = function (keyframe, time, smoothing) {
        if (smoothing === void 0) { smoothing = 0.25; }
        return NumberKeyframe.lerp(this.value, keyframe.value, Easing.interpolate(this.inEasing, keyframe.outEasing, time, smoothing));
    };
    NumberKeyframe.lerp = function (a, b, t) {
        return a + (b - a) * t;
    };
    return NumberKeyframe;
}(Keyframe));
export default NumberKeyframe;
