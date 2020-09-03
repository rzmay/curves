import CurveModifier from '../../CurveModifier';

class Clamp extends CurveModifier<number[]> {
    max: number;
    min: number;

    constructor(
      min = 0,
      max = 1,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.max = max;
      this.min = min;
    }

    protected _modify(value: number[], time: number): number[] {
      return value.map(v => this.clamp(v));
    }

    private clamp(value: number)
    {
        return Math.min(Math.max(value, this.min), this.max);
    }
}

export default Clamp;
