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
import colorString from 'color-string';
import { CurveModifier } from '../../../index';
var Aggregate = /** @class */ (function (_super) {
    __extends(Aggregate, _super);
    function Aggregate(elements, rangeStart, rangeEnd) {
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.elements = elements;
        return _this;
    }
    Aggregate.prototype._modify = function (value, time) {
        var _this = this;
        var result = {};
        Object.keys(value).forEach(function (key) {
            var _a, _b, _c;
            if (typeof value[key] === 'string' && colorString.get(value[key]) !== null) { // Check for color
                var color = colorString.get(value[key]);
                // Apply each color modifier
                var colorResult_1 = { r: color.value[0], g: color.value[1], b: color.value[2] };
                ((_a = _this.elements.color) !== null && _a !== void 0 ? _a : []).forEach(function (modifier) {
                    colorResult_1 = modifier.modifyExternal(colorResult_1, time);
                });
                result[key] = colorString.to[color.model]([colorResult_1.r, colorResult_1.g, colorResult_1.b], color.value[3]);
            }
            else if (Array.isArray(value[key]) && value[key].every(function (e) { return typeof e === 'number'; })) { // Check for number[]
                // Apply each modifier
                var listResult_1 = value[key];
                ((_b = _this.elements.list) !== null && _b !== void 0 ? _b : []).forEach(function (modifier) {
                    listResult_1 = modifier.modifyExternal(listResult_1, time);
                });
                result[key] = listResult_1;
            }
            else if (typeof value[key] === 'object') { // Apply for objects
                // Recurse
                result[key] = _this._modify(value[key], time);
            }
            else { // Apply to specific types
                var keyResult_1 = value[key];
                ((_c = _this.elements[typeof value[key]]) !== null && _c !== void 0 ? _c : []).forEach(function (modifier) {
                    keyResult_1 = modifier.modifyExternal(keyResult_1, time);
                });
                result[key] = keyResult_1;
            }
        });
        return result;
    };
    return Aggregate;
}(CurveModifier));
export default Aggregate;
