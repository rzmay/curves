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
import CurveModifier from '../../CurveModifier';
var Step = /** @class */ (function (_super) {
    __extends(Step, _super);
    function Step(stepLength, rangeStart, rangeEnd) {
        if (stepLength === void 0) { stepLength = 25; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.stepLength = stepLength;
        return _this;
    }
    Step.prototype._modify = function (value, time) {
        return {
            x: Math.floor(value.x / this.stepLength) * this.stepLength,
            y: Math.floor(value.y / this.stepLength) * this.stepLength,
            z: Math.floor(value.z / this.stepLength) * this.stepLength,
        };
    };
    return Step;
}(CurveModifier));
export default Step;
