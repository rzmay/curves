import colorString from 'color-string';
import { Easing } from 'eaz';
import Keyframe from './Keyframe';
import NumberKeyframe from './NumberKeyframe';
import BooleanKeyframe from './BooleanKeyframe';
import StringKeyframe from './StringKeyframe';
import { Vector3Keyframe } from '../../index';

type ObjectKeyframeValue = Record<PropertyKey, any>;
type ConversionType = 'number' | 'string' | 'boolean' | 'object';

class ObjectKeyframe extends Keyframe<object> {
  protected conversionMethods: Record<ConversionType, (key: PropertyKey) => Keyframe<any>>;

  constructor(
    time: number,
    value: object,
    inEasing: Easing = Easing.cubic,
    outEasing: Easing | undefined = undefined,
  ) {
    super(time, value, inEasing, outEasing);

    this.conversionMethods = {
      number: this.numberKeyframe,
      string: this.stringKeyframe,
      boolean: this.booleanKeyframe,
      object: this.objectKeyframe,
    };
  }

  interpolate(keyframe: ObjectKeyframe, time: number): object {
    const result: ObjectKeyframeValue = {};
    const value = this.value as ObjectKeyframeValue;
    const keyframeValue = keyframe.value as ObjectKeyframeValue;

    const keysWithDuplicates = Object.keys(value).concat(Object.keys(keyframeValue));
    const keys = keysWithDuplicates.filter((elem, pos) => keysWithDuplicates.indexOf(elem) === pos);

    keys.forEach((key) => {
      // If null, interpolate from next keyframe
      if (value[key] === undefined) {
        result[key] = keyframe._interpolateKey(this, key, 1 - time);
      } else {
        result[key] = this._interpolateKey(keyframe, key, time);
      }
    });

    return result;
  }

  protected _interpolateKey(keyframe: ObjectKeyframe, key: PropertyKey, time: number): any {
    let result: any;
    const value = this.value as ObjectKeyframeValue;
    const keyframeValue = keyframe.value as ObjectKeyframeValue;

    // Check if value is color string
    if (typeof value[key] === 'string' && colorString.get(value[key]) !== null) {
      const color = colorString.get(value[key]);
      /*
       * Solve with Vec3 keyframes
       * conversion back to original color model fixes discrepancies
       * really all that's necessary is a Vector3 keyframe, rgb works
       */
      const currentColor = this.colorKeyframe(key);
      const nextColor = keyframe.colorKeyframe(key);

      const colorResult = currentColor.color.interpolate(nextColor.color, time);
      const alphaResult = currentColor.alpha.interpolate(nextColor.alpha, time);

      // Convert back to color string, set value
      if (color != null) {
        result = colorString.to[color.model](
          colorResult.x,
          colorResult.y,
          colorResult.z,
          alphaResult,
        );

        return result;
      }
    }

    // Otherwise check primitives
    (Object.keys(this.conversionMethods) as ConversionType[]).forEach((type) => {
      // eslint-disable-next-line valid-typeof
      if (typeof value[key] === type) {
        result = this.conversionMethods[type].bind(this)(key).interpolate(
          keyframe.conversionMethods[type].bind(keyframe)(key),
          time,
        );

        /* If checking object, check if array
        * CONDITIONS:
        * This key is array OR next key is array
        * All keys in this object are integers (indices)
       */
        const isInt = (n: string): boolean => !isNaN(parseInt(n, 10)) && parseInt(n, 10) === parseFloat(n);
        if (
          type === 'object'
          && (Array.isArray(value[key]) || Array.isArray(keyframeValue[key]))
          && Object.keys(value[key]).every(isInt)
        ) {
          // Convert to array
          result = Object.values(result);
        }
      }
    });

    return result;
  }

  booleanKeyframe(key: PropertyKey): BooleanKeyframe {
    const value = this.value as ObjectKeyframeValue;
    if (value[key] === undefined
        || typeof value[key] !== 'boolean'
    ) {
      return new BooleanKeyframe(this.time, false, this.inEasing, this.outEasing);
    }

    return new BooleanKeyframe(
      this.time,
      value[key] as boolean,
      this.inEasing,
      this.outEasing,
    );
  }

  numberKeyframe(key: PropertyKey): NumberKeyframe {
    const value = this.value as ObjectKeyframeValue;
    if (value[key] === undefined
            || typeof value[key] !== 'number'
    ) {
      return new NumberKeyframe(this.time, 0, this.inEasing, this.outEasing);
    }

    return new NumberKeyframe(this.time, value[key] as number, this.inEasing, this.outEasing);
  }

  stringKeyframe(key: PropertyKey): StringKeyframe {
    const value = this.value as ObjectKeyframeValue;
    if (value[key] === undefined
        || typeof value[key] !== 'string'
    ) {
      return new StringKeyframe(this.time, '', this.inEasing, this.outEasing);
    }

    return new StringKeyframe(this.time, value[key] as string, this.inEasing, this.outEasing);
  }

  objectKeyframe(key: PropertyKey): ObjectKeyframe {
    const value = this.value as ObjectKeyframeValue;
    if (value[key] === undefined
        || typeof value[key] !== 'object'
    ) {
      return new ObjectKeyframe(this.time, {}, this.inEasing, this.outEasing);
    }

    return new ObjectKeyframe(this.time, value[key] as object, this.inEasing, this.outEasing);
  }

  colorKeyframe(key: PropertyKey): { color: Vector3Keyframe, alpha: NumberKeyframe } {
    const value = this.value as ObjectKeyframeValue;
    const color = colorString.get(value[key] ?? 'invalid key');

    if (value[key] === undefined
      || typeof value[key] !== 'string'
      || color === null) {
      return {
        color: new Vector3Keyframe(
          this.time,
          { x: 255, y: 255, z: 255 },
          this.inEasing,
          this.outEasing,
        ),
        alpha: new NumberKeyframe(this.time, 1, this.inEasing, this.outEasing),
      };
    }

    return {
      color: new Vector3Keyframe(
        this.time,
        { x: color.value[0], y: color.value[1], z: color.value[2] },
        this.inEasing,
        this.outEasing,
      ),
      alpha: new NumberKeyframe(this.time, color.value[3], this.inEasing, this.outEasing),
    };
  }
}

export default ObjectKeyframe;
