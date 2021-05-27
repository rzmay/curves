import CurveModifier from '../../CurveModifier';

class Step extends CurveModifier<number> {
    stepLength: number;

    constructor(
      stepLength = 1,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.stepLength = stepLength;
    }

    protected _modify(value: number, time: number): number {
      return Math.floor(value / this.stepLength) * this.stepLength;
    }
}

export default Step;
