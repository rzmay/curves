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
import SimplexNoise from 'simplex-noise';
var Noise = /** @class */ (function (_super) {
    __extends(Noise, _super);
    function Noise(amplitude, frequency, seed, rangeStart, rangeEnd) {
        if (amplitude === void 0) { amplitude = 25; }
        if (frequency === void 0) { frequency = 1; }
        if (seed === void 0) { seed = 0; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.amplitude = amplitude;
        _this.frequency = frequency;
        _this.simplexR = new SimplexNoise(seed.toString());
        _this.simplexG = new SimplexNoise((seed + 1).toString());
        _this.simplexB = new SimplexNoise((seed + 2).toString());
        return _this;
    }
    Noise.prototype._modify = function (value, time) {
        var noiseR = this.simplexR.noise2D(time * this.frequency, 0) * this.amplitude;
        var noiseG = this.simplexG.noise2D(time * this.frequency, 0) * this.amplitude;
        var noiseB = this.simplexB.noise2D(time * this.frequency, 0) * this.amplitude;
        return {
            r: value.r + noiseR - (this.amplitude / 2),
            g: value.g + noiseG - (this.amplitude / 2),
            b: value.b + noiseB - (this.amplitude / 2),
        };
    };
    return Noise;
}(CurveModifier));
export default Noise;
