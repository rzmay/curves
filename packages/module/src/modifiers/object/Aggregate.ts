import colorString from 'color-string';
import Curve, { CurveModifier, Keyframe } from '../../index';
import { RGBColor } from '../../interfaces/RGBColor';
import { JSON } from '../../interfaces/JSON';

export type AggregateElements = {
    number?: CurveModifier<number>[];
    boolean?: CurveModifier<boolean>[];
    string?: CurveModifier<string>[];
    list?: CurveModifier<number[]>[];
    color?: CurveModifier<RGBColor>[];
}

class Aggregate extends CurveModifier<JSON> {
    elements: AggregateElements;

    constructor(
      elements: AggregateElements,
      rangeStart: number | undefined = undefined,
      rangeEnd: number | undefined = undefined,
    ) {
      super(rangeStart, rangeEnd);

      this.elements = elements;
    }

    protected _modify(value: JSON, time: number): JSON {
      const result: JSON = {};
      Object.keys(value).forEach((key) => {
        if (typeof value[key] === 'string' && colorString.get(value[key]) !== null) { // Check for color
          const color = colorString.get(value[key]);

          // Apply each color modifier
          let colorResult = { r: color?.value[0] ?? 0, g: color?.value[1] ?? 0, b: color?.value[2] ?? 0 };
          (this.elements.color ?? []).forEach((modifier) => {
            colorResult = modifier.modifyExternal(colorResult, time);
          });

          result[key] = colorString.to[color?.model ?? 'rgb'](
            [colorResult.r, colorResult.g, colorResult.b],
            color?.value[3] ?? 100,
          );
        } else if (
          Array.isArray(value[key])
          && value[key].every((e: any) => typeof e === 'number')
        ) { // Check for number[]
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
          const type = typeof value[key] as ('number' | 'string' | 'boolean' | 'list');
          (this.elements[type] ?? []).forEach((
            modifier: CurveModifier<number | string | boolean | number[]>,
          ) => {
            keyResult = modifier.modifyExternal(keyResult, time);
          });

          result[key] = keyResult;
        }
      });

      return result;
    }
}

export default Aggregate;
