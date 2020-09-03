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
import { CurveModifier } from '../../../index';
var Exclude = /** @class */ (function (_super) {
    __extends(Exclude, _super);
    function Exclude(blacklist, useWhitelist, clamp, rangeStart, rangeEnd) {
        if (useWhitelist === void 0) { useWhitelist = false; }
        if (clamp === void 0) { clamp = true; }
        if (rangeStart === void 0) { rangeStart = undefined; }
        if (rangeEnd === void 0) { rangeEnd = undefined; }
        var _this = _super.call(this, rangeStart, rangeEnd) || this;
        _this.blacklist = blacklist
            .map(function (c) { return c.toLowerCase(); })
            .concat(blacklist.map(function (c) { return c.toUpperCase(); }));
        _this.useWhitelist = useWhitelist;
        _this.clamp = clamp;
        return _this;
    }
    Exclude.prototype._modify = function (value, time) {
        var _this = this;
        var result = '';
        value.split('').forEach(function (character) {
            if (_this.useWhitelist === _this.blacklist.includes(character)) {
                result += character;
            }
            else if (_this.clamp) {
                if (_this.useWhitelist) {
                    // Get nearest character in whitelist
                    var nearest = _this.blacklist
                        .map(function (c) { return c.charCodeAt(0); })
                        .reduce(function (closest, current) {
                        var code = character.charCodeAt(0);
                        return Math.abs(closest - code) < Math.abs(current - code) ? closest : current;
                    });
                    result += String.fromCharCode(nearest);
                }
                else {
                    // Get nearest non-blacklisted character
                    var nearest = '';
                    var interval = 1;
                    while (nearest === '') {
                        var forward = String.fromCharCode(character.charCodeAt(0) + interval);
                        var backward = String.fromCharCode(character.charCodeAt(0) - interval);
                        if (!_this.blacklist.includes(forward)) {
                            nearest = forward;
                        }
                        else if (!_this.blacklist.includes(backward)) {
                            nearest = backward;
                        }
                        else {
                            interval += 1;
                        }
                    }
                    result += nearest;
                }
            }
        });
        return result;
    };
    return Exclude;
}(CurveModifier));
export default Exclude;
