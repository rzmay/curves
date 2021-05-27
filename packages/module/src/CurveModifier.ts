import Curve from './Curve';

abstract class CurveModifier<T> {
    rangeStart: number;
    rangeEnd: number;

    constructor(rangeStart = Number.MIN_VALUE, rangeEnd = Number.MAX_VALUE) {
      this.rangeStart = rangeStart;
      this.rangeEnd = rangeEnd;
    }

    evaluate(curve: Curve<T>, value: T, time: number): T {
      const rangeStart = this.rangeStart * curve.duration + curve.startTime;
      const rangeEnd = this.rangeEnd * curve.duration + curve.startTime;
      const epsilon = 1e-8;

      if (rangeStart <= (time + epsilon) && (time - epsilon) <= rangeEnd) {
        return this._modify(value, time);
      }
      return value;
    }

    modifyExternal(value: T, time: number): T {
      return this._modify(value, time);
    }

    // Optional configuration method
    configure(curve: Curve<T>) {
      // pass
    }

    protected abstract _modify(value: T, time: number): T;
}

export default CurveModifier;
