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
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 255; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        if (typeof min === 'number') {
            _this.min = { r: min, g: min, b: min };
        }
        else {
            _this.min = min;
        }
        if (typeof max === 'number') {
            _this.max = { r: max, g: max, b: max };
        }
        else {
            _this.max = max;
        }
        return _this;
    }
    Clamp.prototype._modify = function (value, time) {
        return {
            r: Math.min(Math.max(value.r, this.min.r), this.max.r),
            g: Math.min(Math.max(value.g, this.min.g), this.max.g),
            b: Math.min(Math.max(value.b, this.min.b), this.max.b),
        };
    };
    return Clamp;
}(CurveModifier));
export default Clamp;
