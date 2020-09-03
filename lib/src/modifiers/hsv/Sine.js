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
import { SineModifierBlendMode } from '../number/Sine';
var Sine = /** @class */ (function (_super) {
    __extends(Sine, _super);
    function Sine(blendMode, amplitude, wavelength, phaseOffset, rangeStart, rangeEnd) {
        if (blendMode === void 0) { blendMode = SineModifierBlendMode.Replace; }
        if (amplitude === void 0) { amplitude = 10; }
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
        var addValue = 0;
        switch (this.blend) {
            case SineModifierBlendMode.Replace:
                addValue = waveValue;
                break;
            case SineModifierBlendMode.Add:
                addValue = waveValue + (0.5 * this.amplitude);
                break;
            case SineModifierBlendMode.Subtract:
                addValue = waveValue - (0.5 * this.amplitude);
                break;
            case SineModifierBlendMode.Multiply:
                return {
                    h: value.h * 3.6 * waveValue,
                    s: value.s * waveValue,
                    v: value.s * waveValue,
                };
            case SineModifierBlendMode.MultiplyPositive:
                return {
                    h: value.h * 3.6 * (waveValue + this.amplitude) / 2,
                    s: value.s * (waveValue + this.amplitude) / 2,
                    v: value.v * (waveValue + this.amplitude) / 2,
                };
            default:
                addValue = 0; // Unreachable
        }
        return {
            h: value.h + addValue * 3.6,
            s: value.s + addValue,
            v: value.v + addValue,
        };
    };
    return Sine;
}(CurveModifier));
export default Sine;
