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
import SimplexNoise from 'simplex-noise';
import CurveModifier from '../../CurveModifier';
var Noise = /** @class */ (function (_super) {
    __extends(Noise, _super);
    function Noise(amplitude, frequency, seed, rangeStart, rangeEnd) {
        if (amplitude === void 0) { amplitude = 2; }
        if (frequency === void 0) { frequency = 1; }
        if (seed === void 0) { seed = 0; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.amplitude = amplitude;
        _this.frequency = frequency;
        _this.simplex = new SimplexNoise(seed.toString());
        return _this;
    }
    Noise.prototype._modify = function (value, time) {
        var numberValue = value ? 1 : 0;
        var noiseValue = numberValue - (this.amplitude / 2) + this.simplex.noise2D(time * this.frequency, 0) * this.amplitude;
        return noiseValue > (0.5 / this.amplitude);
    };
    return Noise;
}(CurveModifier));
export default Noise;
