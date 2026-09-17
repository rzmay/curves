import colorString from 'color-string';
import Curve, { CurveModifier, Keyframe } from '../../../index';
import { RGBColor } from '../../interfaces/RGBColor';

export type AggregateElements = {
    number?: CurveModifier<number>[],
    boolean?: CurveModifier<boolean>[],
    string?: CurveModifier<string>[],
    list?: CurveModifier<number[]>[],
    color?: CurveModifier<RGBColor>[]
}

type AggregateValue = Record<string, any>;
type AggregatePrimitiveElement = 'number' | 'boolean' | 'string';

const isAggregatePrimitiveElement = (type: string): type is AggregatePrimitiveElement => (
  type === 'number' || type === 'boolean' || type === 'string'
);

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
      const result: AggregateValue = {};
      const aggregateValue = value as AggregateValue;
      Object.keys(aggregateValue).forEach((key) => {
        if (typeof aggregateValue[key] === 'string' && colorString.get(aggregateValue[key]) !== null) { // Check for color
          const color = colorString.get(aggregateValue[key]);
          if (color != null) {
            // Apply each color modifier
            let colorResult = { r: color.value[0], g: color.value[1], b: color.value[2] };
            (this.elements.color ?? []).forEach((modifier) => {
              colorResult = modifier.modifyExternal(colorResult, time);
            });

            result[key] = colorString.to[color.model](
              colorResult.r,
              colorResult.g,
              colorResult.b,
              color.value[3],
            );
          }
        } else if (Array.isArray(aggregateValue[key]) && aggregateValue[key].every((e) => typeof e === 'number')) { // Check for number[]
          // Apply each modifier
          let listResult = aggregateValue[key];
          (this.elements.list ?? []).forEach((modifier) => {
            listResult = modifier.modifyExternal(listResult, time);
          });

          result[key] = listResult;
        } else if (typeof aggregateValue[key] === 'object') { // Apply for objects
          // Recurse
          result[key] = this._modify(aggregateValue[key], time);
        } else { // Apply to specific types
          let keyResult = aggregateValue[key];
          const valueType = typeof aggregateValue[key];
          if (isAggregatePrimitiveElement(valueType)) {
            (this.elements[valueType] ?? []).forEach((modifier: CurveModifier<any>) => {
              keyResult = modifier.modifyExternal(keyResult, time);
            });
          }

          result[key] = keyResult;
        }
      });

      return result;
    }
}

export default Aggregate;
