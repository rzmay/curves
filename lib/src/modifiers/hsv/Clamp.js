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
var Clamp = /** @class */ (function (_super) {
    __extends(Clamp, _super);
    function Clamp(min, max, rangeStart, rangeEnd) {
        if (min === void 0) { min = { h: 0, s: 0, v: 0 }; }
        if (max === void 0) { max = { h: 360, s: 100, v: 100 }; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.max = max;
        _this.min = min;
        return _this;
    }
    Clamp.prototype._modify = function (value, time) {
        return {
            h: Math.min(Math.max(value.h, this.min.h), this.max.h),
            s: Math.min(Math.max(value.s, this.min.s), this.max.s),
            v: Math.min(Math.max(value.v, this.min.v), this.max.v),
        };
    };
    return Clamp;
}(CurveModifier));
export default Clamp;
