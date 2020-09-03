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
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
var RGBColorKeyframe = /** @class */ (function (_super) {
    __extends(RGBColorKeyframe, _super);
    function RGBColorKeyframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    RGBColorKeyframe.prototype.interpolate = function (keyframe, time) {
        var floatKeyframes = this.toFloatKeyframe();
        var nextFloatKeyframes = keyframe.toFloatKeyframe();
        return {
            r: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
            g: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
            b: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
        };
    };
    RGBColorKeyframe.prototype.toFloatKeyframe = function () {
        return [
            new NumberKeyframe(this.time, this.value.r, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.g, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.b, this.inEasing, this.outEasing),
        ];
    };
    return RGBColorKeyframe;
}(Keyframe));
export default RGBColorKeyframe;
