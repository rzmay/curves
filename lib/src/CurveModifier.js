var CurveModifier = /** @class */ (function () {
    function CurveModifier(rangeStart, rangeEnd) {
        if (rangeStart === void 0) { rangeStart = Number.MIN_VALUE; }
        if (rangeEnd === void 0) { rangeEnd = Number.MAX_VALUE; }
        this.rangeStart = rangeStart;
        this.rangeEnd = rangeEnd;
    }
    CurveModifier.prototype.evaluate = function (curve, value, time) {
        var rangeStart = this.rangeStart * curve.duration + curve.startTime;
        var rangeEnd = this.rangeEnd * curve.duration + curve.startTime;
        var epsilon = 1e-8;
        if (rangeStart <= (time + epsilon) && (time - epsilon) <= rangeEnd) {
            return this._modify(value, time);
        }
        return value;
    };
    CurveModifier.prototype.modifyExternal = function (value, time) {
        return this._modify(value, time);
    };
    // Optional configuration method
    CurveModifier.prototype.configure = function (curve) {
        // pass
    };
    return CurveModifier;
}());
export default CurveModifier;
