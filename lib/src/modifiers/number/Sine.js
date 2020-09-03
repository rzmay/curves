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
var SineModifierBlendMode;
(function (SineModifierBlendMode) {
    SineModifierBlendMode[SineModifierBlendMode["Replace"] = 0] = "Replace";
    SineModifierBlendMode[SineModifierBlendMode["Add"] = 1] = "Add";
    SineModifierBlendMode[SineModifierBlendMode["Subtract"] = 2] = "Subtract";
    SineModifierBlendMode[SineModifierBlendMode["Multiply"] = 3] = "Multiply";
    SineModifierBlendMode[SineModifierBlendMode["MultiplyPositive"] = 4] = "MultiplyPositive";
})(SineModifierBlendMode || (SineModifierBlendMode = {}));
var Sine = /** @class */ (function (_super) {
    __extends(Sine, _super);
    function Sine(blendMode, amplitude, wavelength, phaseOffset, rangeStart, rangeEnd) {
        if (blendMode === void 0) { blendMode = SineModifierBlendMode.Replace; }
        if (amplitude === void 0) { amplitude = 0.1; }
        if (wavelength === void 0) { wavelength = 1; }
        if (phaseOffset === void 0) { phaseOffset = 0; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.amplitude = amplitude;
        _this.wavelength = wavelength;
        _this.phaseOffset = phaseOffset;
        _this.blend = blendMode;
        return _this;
    }
    Sine.prototype._modify = function (value, time) {
        var waveValue = Math.sin((time - this.phaseOffset)
            * 2 * Math.PI * (1 / this.wavelength)) * this.amplitude;
        switch (this.blend) {
            case SineModifierBlendMode.Replace:
                return value + waveValue;
            case SineModifierBlendMode.Add:
                return value + waveValue + (0.5 * this.amplitude);
            case SineModifierBlendMode.Subtract:
                return value + waveValue - (0.5 * this.amplitude);
            case SineModifierBlendMode.Multiply:
                return value * waveValue;
            case SineModifierBlendMode.MultiplyPositive:
                return value * (waveValue + this.amplitude) / 2;
            default:
                return value; // Unreachable
        }
    };
    return Sine;
}(CurveModifier));
export { SineModifierBlendMode };
export default Sine;
