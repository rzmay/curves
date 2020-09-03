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
var Vector3Keyframe = /** @class */ (function (_super) {
    __extends(Vector3Keyframe, _super);
    function Vector3Keyframe() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Vector3Keyframe.prototype.interpolate = function (keyframe, time) {
        var floatKeyframes = this.toFloatKeyframe();
        var nextFloatKeyframes = keyframe.toFloatKeyframe();
        return {
            x: floatKeyframes[0].interpolate(nextFloatKeyframes[0], time),
            y: floatKeyframes[1].interpolate(nextFloatKeyframes[1], time),
            z: floatKeyframes[2].interpolate(nextFloatKeyframes[2], time),
        };
    };
    Vector3Keyframe.prototype.toFloatKeyframe = function () {
        return [
            new NumberKeyframe(this.time, this.value.x, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.y, this.inEasing, this.outEasing),
            new NumberKeyframe(this.time, this.value.z, this.inEasing, this.outEasing),
        ];
    };
    return Vector3Keyframe;
}(Keyframe));
export default Vector3Keyframe;
