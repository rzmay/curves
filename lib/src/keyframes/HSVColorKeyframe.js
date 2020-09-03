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
var HSVColorKeyframe = /** @class */ (function (_super) {
    __extends(HSVColorKeyframe, _super);
    function HSVColorKeyframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    HSVColorKeyframe.prototype.interpolate = function (keyframe, time) {
        var floatKeyframes = this.toFloatKeyframe();
        var nextFloatKeyframes = keyframe.toFloatKeyframe();
        return {
            h: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
            s: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
            v: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
        };
    };
    HSVColorKeyframe.prototype.toFloatKeyframe = function () {
        return [
            new NumberKeyframe(this.time, this.value.h, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.s, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.v, this.inEasing, this.outEasing),
        ];
    };
    return HSVColorKeyframe;
}(Keyframe));
export default HSVColorKeyframe;
