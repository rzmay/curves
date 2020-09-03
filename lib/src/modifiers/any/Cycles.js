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
var Cycles = /** @class */ (function (_super) {
    __extends(Cycles, _super);
    function Cycles(startTime, endTime, rangeStart, rangeEnd) {
        if (startTime === void 0) { startTime = 0; }
        if (endTime === void 0) { endTime = 0.5; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.startTime = startTime;
        _this.endTime = endTime;
        return _this;
    }
    Cycles.prototype.configure = function (curve) {
        this._curve = curve;
    };
    Cycles.prototype._modify = function (value, time) {
        if (this._curve === undefined) {
            return value;
        }
        var cyclicTime = (time - this.startTime) % (this.endTime - this.startTime);
        if (cyclicTime < 0)
            cyclicTime += (this.endTime - this.startTime);
        cyclicTime += this.startTime;
        var modifierIndex = this._curve.modifiers.indexOf(this);
        return this._curve.evaluate(cyclicTime, modifierIndex);
    };
    return Cycles;
}(CurveModifier));
export default Cycles;
