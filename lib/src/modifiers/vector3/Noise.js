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
        if (amplitude === void 0) { amplitude = 25; }
        if (frequency === void 0) { frequency = 1; }
        if (seed === void 0) { seed = 0; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        if (typeof amplitude === 'number') {
            _this.amplitude = { x: amplitude, y: amplitude, z: amplitude };
        }
        else {
            _this.amplitude = amplitude;
        }
        _this.frequency = frequency;
        _this.simplexX = new SimplexNoise(seed.toString());
        _this.simplexY = new SimplexNoise((seed + 1).toString());
        _this.simplexZ = new SimplexNoise((seed + 2).toString());
        return _this;
    }
    Noise.prototype._modify = function (value, time) {
        var noiseX = this.simplexX.noise2D(time * this.frequency, 0) * this.amplitude.x;
        var noiseY = this.simplexY.noise2D(time * this.frequency, 0) * this.amplitude.y;
        var noiseZ = this.simplexZ.noise2D(time * this.frequency, 0) * this.amplitude.z;
        return {
            x: value.x + noiseX - (this.amplitude.x / 2),
            y: value.y + noiseY - (this.amplitude.y / 2),
            z: value.z + noiseZ - (this.amplitude.z / 2),
        };
    };
    return Noise;
}(CurveModifier));
export default Noise;
