import colorString from 'color-string';
import Curve, { CurveModifier, Keyframe } from '../../../index';
import { RGBColor } from '../../interfaces/RGBColor';

type AggregateElements = {
    number?: CurveModifier<number>[],
    boolean?: CurveModifier<boolean>[],
    string?: CurveModifier<string>[],
    list?: CurveModifier<number[]>[],
    color?: CurveModifier<RGBColor>[]
}

class Aggregate extends CurveModifier<object> {
    elements: AggregateElements;

    constructor(
      elements: AggregateElements,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.elements = elements;
    }

    protected _modify(value: object, time: number): object {
      const result = {};
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'string' && colorString.get(value[key]) !== null) { // Check for color
          const color = colorString.get(value[key]);

          // Apply each color modifier
          let colorResult = { r: color.value[0], g: color.value[1], b: color.value[2] };
          (this.elements.color ?? []).forEach((modifier) => {
            colorResult = modifier.modifyExternal(colorResult, time);
          });

          result[key] = colorString.to[color.model](
            [colorResult.r, colorResult.g, colorResult.b],
            color.value[3],
          );
        } else if (Array.isArray(value[key]) && value[key].every((e) => typeof e === 'number')) { // Check for number[]
          // Apply each modifier
          let listResult = value[key];
          (this.elements.list ?? []).forEach((modifier) => {
            listResult = modifier.modifyExternal(listResult, time);
          });

          result[key] = listResult;
        } else if (typeof value[key] === 'object') { // Apply for objects
          // Recurse
          result[key] = this._modify(value[key], time);
        } else { // Apply to specific types
          let keyResult = value[key];
          (this.elements[typeof value[key]] ?? []).forEach((modifier) => {
            keyResult = modifier.modifyExternal(keyResult, time);
          });

          result[key] = keyResult;
        }
      });

      return result;
    }
}

export default Aggregate;
