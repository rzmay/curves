import { Easing } from 'eaz';
var Keyframe = /** @class */ (function () {
    function Keyframe(time, value, inEasing, outEasing) {
        if (inEasing === void 0) { inEasing = Easing.cubic; }
        if (outEasing === void 0) { outEasing = undefined; }
        this.time = time;
        this.value = value;
        this.inEasing = inEasing;
        this.outEasing = outEasing !== null && outEasing !== void 0 ? outEasing : inEasing;
    }
    Keyframe.prototype.interpolateRealtime = function (keyframe, time, smoothing) {
        if (smoothing === void 0) { smoothing = 0.25; }
        var alpha = (time - this.time) / (keyframe.time - this.time);
        return this.interpolate(keyframe, alpha, smoothing);
    };
    // Optional configuration for curve dependent keyframes
    Keyframe.prototype.configure = function (curve) {
        // pass
    };
    return Keyframe;
}());
export default Keyframe;
