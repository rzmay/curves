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

  // Create a custom modifier quickly without defining a new class
  // static subclass<T>(
  //   modify: (modifier: CurveModifierWithParams<T>, value: T, time: number) => T,
  //   configure: ((modifier: CurveModifierWithParams<T>, curve: Curve<T>) => void) | undefined = undefined,
  // ): (
  //     params: object,
  //     rangeStart: number | undefined,
  //     rangeEnd: number | undefined,
  // ) => CurveModifierWithParams<T> {
  //   class Subclass extends CurveModifierWithParams<T> {
  //     configure(curve: Curve<T>) {
  //       if (configure) configure(this as Subclass, curve);
  //     }
  //
  //     protected _modify(value: T, time: number): T {
  //       return modify(this as Subclass, value, time);
  //     }
  //   }
  //
  //   return (
  //     params: object = {},
  //     rangeStart: number | undefined = undefined,
  //     rangeEnd: number | undefined = undefined,
  //   ) => new Subclass(params, rangeStart, rangeEnd);
  // }
}

export default CurveModifier;
