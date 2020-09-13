import CurveModifier from './CurveModifier';

abstract class CurveModifierWithParams<T> extends CurveModifier<T> {
    params: object

    constructor(
      params: object,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);
      this.params = params;
    }
}

export default CurveModifierWithParams;
