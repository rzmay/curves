import CurveModifier from '../../CurveModifier';
import { Curve } from '../../../index';

class Cycles<T> extends CurveModifier<T> {
    startTime: number;
    endTime: number;

    private _curve: Curve<T> | undefined;

    constructor(
      startTime = 0,
      endTime = 0.5,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.startTime = startTime;
      this.endTime = endTime;
    }

    configure(curve: Curve<T>) {
      this._curve = curve;
    }

    protected _modify(value: T, time: number): T {
      if (this._curve === undefined) { return value; }

      let cyclicTime = (time - this.startTime) % (this.endTime - this.startTime);
      if (cyclicTime < 0) cyclicTime += (this.endTime - this.startTime);

      cyclicTime += this.startTime;

      const modifierIndex = this._curve.modifiers.indexOf(this);

      return this._curve.evaluate(cyclicTime, modifierIndex);
    }
}

export default Cycles;
