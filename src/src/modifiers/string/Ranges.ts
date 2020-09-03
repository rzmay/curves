import Curve, { CurveModifier, Keyframe } from '../../../index';

type range = {min: number, max: number};

class Ranges extends CurveModifier<string> {
    public static CapitalAlpha = Ranges.createRange('A', 'Z');
    public static LowercaseAlpha = Ranges.createRange('a', 'z');
    public static Numeric = Ranges.createRange('0', '9');
    public static AlphaAccent = Ranges.createRange('À', 'ÿ');
    public static NonControl = Ranges.createRange(32, 255);

    public static Alpha = [Ranges.CapitalAlpha, Ranges.LowercaseAlpha];
    public static AlphaNumeric = [Ranges.CapitalAlpha, Ranges.LowercaseAlpha, Ranges.Numeric];

    ranges: range[];
    clamp: boolean; // Should values outside of the ranges be clamped to ranges? or should they be excluded?
    allowKeyframeValues: boolean; // Should values used in keyframes be included?

    private _whitelist: string[] = [];

    constructor(
      ranges: range | range[] = Ranges.AlphaNumeric,
      clamp = true,
      allowKeyframeValues = true,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.ranges = Array.isArray(ranges) ? ranges : [ranges];
      this.clamp = clamp;
      this.allowKeyframeValues = allowKeyframeValues;
    }

    configure(curve: Curve<string>) {
      this._whitelist = [];
      curve.keys.forEach((key) => {
        this._whitelist = this._whitelist.concat(key.value.split(''));
      });
    }

    protected _modify(value: string, time: number): string {
      let result = '';
      value.split('').forEach((char) => {
        // Check if character in ranges
        if (this._isInRanges(char)) {
          result += char;
        } else if (this.clamp) {
          // Get nearest character in bounds
          const nearest = this._createBoundsList().reduce((closest, current) => {
            const code = char.charCodeAt(0);
            return Math.abs(closest - code) < Math.abs(current - code) ? closest : current;
          });
          result += String.fromCharCode(nearest);
        }
      });

      return result;
    }

    private _isInRanges(character: string) {
      let isInRanges = false;
      const code = character.charCodeAt(0);
      this.ranges.forEach((r) => {
        isInRanges = isInRanges || (r.min <= code && code <= r.max);
      });

      if (this.allowKeyframeValues) isInRanges = isInRanges || this._whitelist.includes(character);

      return isInRanges;
    }

    private _createBoundsList(): number[] {
      const bounds: number[] = [];
      this.ranges.forEach((r) => {
        bounds.push(r.max);
        bounds.push(r.min);
      });
      return bounds;
    }

    static createRange(min: number | string, max: number | string): range {
      const range: range = { min: 0, max: 0 };

      if (typeof min === 'string') range.min = min.charCodeAt(0);
      else range.min = min;

      if (typeof max === 'string') range.max = max.charCodeAt(0);
      else range.max = max;

      return range;
    }
}

export default Ranges;
